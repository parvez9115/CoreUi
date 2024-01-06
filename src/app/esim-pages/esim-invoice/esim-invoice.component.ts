import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { url } from 'inspector';
import jsPDF from 'jspdf';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';
@Component({
  selector: 'colour-cell',
  template: `<button class="button">
    {{ params.text }}
  </button>`,
  styles: [
    `
      .button {
        margin: 10px;
        background-color: white;
        color: #3b82f6;
        border-color: transparent;
        line-height: 2;
        border-radius: 5px;
        width: max-content;
        margin-top: 5px;
        padding: 0px 5px;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        background-size: 200% auto;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
          0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
        display: block;
      }
      .button:active,
      .button:focus {
        outline: 2px solid #321fdb70;
        outline-offset: 2px;
      }
    `,
  ],
})
class ColourCellRenderer implements ICellRendererAngularComp {
  params!: any;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    this.params = params;
    // As we have updated the params we return true to let AG Grid know we have handled the refresh.
    // So AG Grid will not recreate the cell renderer from scratch.
    return true;
  }
}
@Component({
  selector: 'app-esim-invoice',
  templateUrl: './esim-invoice.component.html',
  styleUrls: ['./esim-invoice.component.scss'],
  animations: [
    trigger('fadeOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0, transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class EsimInvoiceComponent {
  visiblePrint = false;
  @ViewChild('two') d1: ElementRef;
  invoiceForm: FormGroup;
  payForm: FormGroup;
  selectedRowSize: number;
  pagePermission: any;
  items = [];
  visible = false;
  download() {
    const doc = new jsPDF();
    doc.html(this.d1.nativeElement, {
      html2canvas: {
        scale: 0.19, //595.26 is the width of A4 page
        scrollY: 0,
      },
      filename: 'jspdf',
      x: 0,
      y: 0,
      callback: (pdf) => {
        pdf.save('Invoice');
      },
    });
  }
  handlevisiblePrint(event: any) {
    this.visiblePrint = event;
  }
  print() {
    const printContents = document.getElementById('two')?.innerHTML;
    const pageContent = `<!DOCTYPE html><html><head></head><body onload="window.print()">${printContents}</html>`;
    let popupWindow: Window;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWindow = window.open(
        '',
        '_blank',
        'width=1400,height=1600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      );
      popupWindow.window.focus();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
      popupWindow.onbeforeunload = (event) => {
        popupWindow.close();
      };
      popupWindow.onabort = (event) => {
        popupWindow.document.close();
        popupWindow.close();
      };
    } else {
      popupWindow = window.open('', '_blank', 'width=600,height=600');
      popupWindow.document.open();
      popupWindow.document.write(printContents);
      popupWindow.document.close();
    }
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }
  togglePayDemo() {
    this.visiblePay = !this.visiblePay;
  }
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  handlePayDemoChange(event: any) {
    this.visiblePay = event;
  }

  savePaid() {
    this.loader.presentLoader();
    let url = ServerUrl.live + '/esim/saveCustomerPayments';
    let body = {
      customer_id: this.payData['customer_id'],
      invoices: [
        {
          invoice_id: this.payData['invoice_id'],
          amount_applied: this.payForm.value.amount,
        },
      ],
      payment_mode: 'Cash',
      date: this.payForm.value.date,
      exchange_rate: '1',
      amount: this.payForm.value.amount,
      bank_charges: '',
      account_id: '4260517000000000361',
      custom_fields: [],
      documents: [],
    };
    this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
      if (
        JSON.parse(res.Response).message ==
        'The payment from the customer has been recorded'
      ) {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: JSON.parse(res.Response).message,
        });
        this.togglePayDemo();
        this.onGridReady();
        this.payData = {};
      } else {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: JSON.parse(res.Response).message,
        });
      }
    });
  }

  toolbarsave = [
    // {
    //   label: 'Draft',
    //   icon: 'pi pi-refresh',
    //   command: () => {
    //     this.save('draft');
    //   },
    // },
    {
      label: 'Clear',
      icon: 'pi pi-times',
      command: () => {
        this.clearAll();
      },
    },
  ];

  hello() {
    alert('shbdh');
  }
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService
  ) {}

  payData = {};
  paymentCheck = [];
  paymentOptions: any;
  @ViewChild('myGrid', { static: false }) myGrid: any;
  visiblePay = false;
  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };
  rowData = [];

  columnDefs: any = [
    {
      headerName: 'Invoice Id',
      field: 'invoice_id',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Customer Id',
      field: 'customer_id',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Customer Name',
      field: 'customer_name',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: 'agTextColumnFilter',
      width: 150,
    },
    {
      headerName: 'Invoice Number',
      field: 'invoice_number',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Date',
      field: 'date',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Total',
      field: 'total',
      filter: 'agTextColumnFilter',
      width: 170,
    },
    {
      headerName: 'Balance',
      field: 'balance',
      filter: 'agTextColumnFilter',
      width: 170,
    },
    {
      width: 170,

      cellRenderer: ColourCellRenderer,
      cellRendererParams: {
        text: 'View Invoice',
      },
      onCellClicked: this.openInvoice.bind(this),
      sortable: false,
    },
    {
      width: 190,

      cellRenderer: ColourCellRenderer,
      cellRendererParams: {
        text: 'Record payment',
      },
      onCellClicked: this.pay.bind(this),
      sortable: false,
    },
  ];
  deleteRow(index) {
    const add = this.invoiceForm.get('invoiceFields') as FormArray;
    if (add.length > 1) {
      add.removeAt(index);
    }
  }
  pay(e) {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    if (e.data.balance == 0) {
      this.loader.dismissLoader();
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail:
          'The full invoice amount has already been paid; therefore, we cannot record any further payment.',
      });
    } else {
      this.payForm.patchValue({
        amount: 0,
        date: today,
      });
      this.payData = e.data;
      this.togglePayDemo();
    }
  }
  openInvoice(e) {
    this.loader.presentLoader();

    let url =
      ServerUrl.live + '/esim/getInvoiceById?invoiceId=' + e.data.invoice_id;
    this.ajaxService.ajaxgetHtml(url).subscribe((res) => {
      this.d1.nativeElement.innerHTML = '';

      this.visible = !this.visible;
      this.loader.dismissLoader();

      this.d1.nativeElement.insertAdjacentHTML('beforeend', res);

      document.getElementById('header').style.display = 'none';
      document.getElementById('header_otherpages').style.display = 'none';
      let footer: any = document.getElementsByClassName(
        'pcs-template-footer'
      ) as HTMLCollectionOf<HTMLElement>;
      footer[0].style.display = 'none';
      this.visiblePrint = !this.visiblePrint;
    });
  }

  export() {
    let data = this.rowData;
    let coloumnArray = [];

    this.myGrid.columnDefs.map((p) => {
      coloumnArray.push(p.field);
    });

    for (let i = 0; i < data.length; i++) {
      let k = Object.keys(data[i]);
      for (let j = 0; j < k.length; j++) {
        if (coloumnArray.includes(k[j]) == false) {
          delete data[i][k[j].toString()];
        }
      }
    }

    let forExcel = [];
    data.map((val) => {
      let newArray = Object.values(val);
      forExcel.push(newArray);
    });

    var Header = Object.keys(data[0]);

    let reportData = {
      title: 'Esim Invoice',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  onGridReady() {
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/getInvoice';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = JSON.parse(res.Response)['invoices'];
      this.loader.dismissLoader();
    });
  }
  getName(data) {
    return this.items.filter((d) => d.item_id == data);
  }
  save() {
    this.loader.presentLoader();
    if (this.invoiceForm.value.customerId != null) {
      var paymentRecieved = this.paymentCheck[0] ? 'true' : 'false';
      var url =
        ServerUrl.live + '/esim/createInvoice?quickCreate=' + paymentRecieved;
      let body = {};

      let {
        customerId,
        invoicedate,
        discount,
        invoiceFields,
        selectedPayment,
      } = this.invoiceForm.value;
      body['customer_id'] = customerId;
      body['quick_create_payment'] = {
        account_id: '4260517000000000361',
        payment_mode: selectedPayment,
      };
      body['discount_type'] = 'entity_level';
      body['discount'] = discount + '%';
      body['line_items'] = [];
      invoiceFields.map((d, i) => {
        body['line_items'].push({
          item_id: d.item,
          time_entry_ids: [],
          expense_id: ' ',
          name: this.getName(d.item)[0]['item_name'],
          description: d.description,
          expense_receipt_name: 'string',
          quantity: d.quantity,
          discount: '0%',
          tags: [],
          item_order: i + 1,
          date: invoicedate,
          rate: d.rate,
          bcy_rate: d.rate,
          tax_id: '',
          tax_name: '',
          tax_type: 'tax',
          unit: ' ',
          tax_percentage: '0',
          header_name: 'Electronic devices',
          discount_amount: Math.abs(this.total - this.subtotal),
        });
      });

      this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
        if (
          JSON.parse(res.Response).message == 'The invoice has been created.'
        ) {
          this.loader.dismissLoader();
          this.messageService.add({
            key: 'toast1',
            severity: 'success',
            summary: 'Success',
            detail: JSON.parse(res.Response).message,
          });
          this.clearAll();
          this.onGridReady();
          var copyText = document.createElement('input');
          copyText.value = JSON.parse(res.Response).invoice.invoice_id;
          // Select the text field
          copyText.select();
          copyText.setSelectionRange(0, 99999); // For mobile devices

          // Copy the text inside the text field
          navigator.clipboard.writeText(copyText.value);
        } else {
          this.loader.dismissLoader();
          this.messageService.add({
            key: 'toast1',
            severity: 'warn',
            summary: 'Warning',
            detail: JSON.parse(res.Response).message,
          });
        }
      });
    } else {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select the customer name',
      });
    }
  }
  getItems() {
    let url = ServerUrl.live + '/esim/getItems';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.items = JSON.parse(res.Response)['items'];
    });
  }
  customers = [];
  getCustomers() {
    let url = ServerUrl.live + '/esim/getCustomers';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.customers = JSON.parse(res.Response)['contact_persons'];
    });
  }
  subscribe: Subscription;
  total: number = 0.0;

  subtotal: number = 0.0;

  setDiscount(e) {
    this.total =
      this.subtotal * ((100 - Number(this.invoiceForm.value.discount)) / 100);
  }

  resetPayment() {
    this.paymentCheck = [];

    this.invoiceForm.patchValue({
      selectedPayment: 'Cash',
    });
  }
  clearAll() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.invoiceForm.reset();
    let arr = this.invoiceForm.get('invoiceFields') as FormArray;
    while (arr.length !== 1) {
      arr.removeAt(0);
    }
    this.invoiceForm.patchValue({
      discount: 0,
      invoicedate: today,
    });
  }
  rateWithQuantity(e, form: FormGroup) {
    let rate = form['value'].rate;
    let quantity = form['value'].quantity;

    form.patchValue({
      amount: rate * quantity,
    });
  }
  setPrice(value, data: FormGroup) {
    let datas: any = this.items;
    let filteredItems = datas.filter((d) => d.item_id == value.value);

    data.patchValue({
      quantity: 1,
    });

    data.patchValue({
      rate: filteredItems[0]['rate'],
    });

    let rate = data['value'].rate;
    let quantity = data['value'].quantity;

    data.patchValue({
      amount: rate * quantity,
    });
  }
  get capValues() {
    return this.invoiceForm.get('invoiceFields') as FormArray;
  }
  addRow() {
    let add = this.invoiceForm.get('invoiceFields') as FormArray;
    add.push(
      this.formBuilder.group({
        item: ['', Validators.required],
        quantity: [1, Validators.required],
        description: [null],
        rate: [0.0, Validators.required],
        amount: [0.0, Validators.required],
      })
    );
  }

  ngOnInit() {
    this.getItems();
    this.getCustomers();
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.pagePermission = this.permission.getPermissionDetails('Esim Invoice');

    this.invoiceForm = this.formBuilder.group({
      customerId: [null, Validators.required],
      invoicedate: [today, Validators.required],
      selectedPayment: ['Cash'],
      discount: [0],
      invoiceFields: this.formBuilder.array([
        this.formBuilder.group({
          item: ['', Validators.required],
          description: [null],
          quantity: [1, Validators.required],
          rate: [0.0, Validators.required],
          amount: [0.0, Validators.required],
        }),
      ]),
    });

    this.subscribe = this.capValues.valueChanges.subscribe((data) => {
      this.subtotal = data.reduce((a, b) => a + b.amount, 0);
    });
    this.subscribe = this.capValues.valueChanges.subscribe((data) => {
      this.total = data.reduce((a, b) => a + b.amount, 0);
      this.total =
        this.subtotal * ((100 - this.invoiceForm.value.discount) / 100);
    });

    this.paymentOptions = [
      'Check',
      'Cash',
      'Bank Tranfser',
      'Credit Card',
      'Bank Remittance',
    ]; //[{ name: "Check" }, { name: "Cash" }, { name: "Bank Tranfser" }, { name: "Credit Card" }, { name: "Bank Remittance" }];

    // this.subscribe = this.invoiceForm.controls[
    //   'discount'
    // ].valueChanges.subscribe((data) => {
    //   this.total = data.reduce((a, b) => a + b.amount, 0);
    //   this.subtotal =
    //     this.subtotal * ((100 - this.invoiceForm.value.discount) / 100);
    // });

    this.payForm = this.formBuilder.group({
      date: [today, Validators.required],
      amount: [0, Validators.required],
    });
  }
}
