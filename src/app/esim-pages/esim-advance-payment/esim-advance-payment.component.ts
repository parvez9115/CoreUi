import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { GridPaginationService } from 'src/app/service/grid-pagination.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';

@Component({
  selector: 'colour-cell',
  imports: [CommonModule],
  standalone: true,
  template: `<button *ngIf="params.text == 'status'" #button class="button">
      {{ params.data.acceptedstatus == false ? 'Accept' : 'Accepted' }}
    </button>
    <button *ngIf="params.text == 'rejectstatus'" #button class="button">
      {{ params.data.rejectedstatus == false ? 'Reject' : 'Rejected' }}
    </button>
    <button *ngIf="params.text == 'Rejected Reason'" #button class="button">
      {{ params.data.rejectedstatus == true ? 'Rejected Reason' : 'Reason' }}
    </button>
    <button *ngIf="params.text == 'Edit'" #button class="button">
      {{ params.data.acceptedstatus == false ? 'Edit' : 'Edit' }}
    </button>
    <button *ngIf="params.text == 'Delete'" #button class="button">
      {{ params.data.acceptedstatus == false ? 'Delete' : 'Delete' }}
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

      .button:disabled {
        opacity: 0.5;
        box-shadow: none;
      }
    `,
  ],
})
class disableableButtonRenderer
  implements ICellRendererAngularComp, AfterViewInit
{
  ngAfterViewInit(): void {
    const isAccepted = this.params.data.acceptedstatus === true;
    const isRejected = this.params.data.rejectedstatus === true;

    if (
      (this.params.text === 'rejectstatus' && (isRejected || isAccepted)) ||
      (this.params.text === 'status' && isAccepted) ||
      (this.params.text === 'status' && isRejected)
    ) {
      this.button.nativeElement.disabled = true;
    } else if (
      (this.params.text === 'status' && !isAccepted) ||
      (this.params.text === 'rejectstatus' && !isRejected)
    ) {
      this.button.nativeElement.disabled = false;
    }

    if (this.params.text === 'Rejected Reason' && !isRejected) {
      this.button.nativeElement.disabled = true;
    }

    if (this.params.text === 'Edit' || this.params.text === 'Delete') {
      this.button.nativeElement.disabled = isAccepted || isRejected;
    }
  }
  params!: any;
  @ViewChild('button', { static: false }) button: ElementRef;

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
  selector: 'app-esim-advance-payment',
  templateUrl: './esim-advance-payment.component.html',
  styleUrls: ['./esim-advance-payment.component.scss'],
})
export class EsimAdvancePaymentComponent {
  selectedMonth: any = '';
  editData;
  visible = false;
  dataString: any;
  endisConfirm: boolean = false;
  value: any;
  isEdit: boolean = false;
  endisYear: boolean = false;
  rejectedModalToggle: boolean = false;
  saveAdvancePayment: FormGroup;

  maxDate: string;
  @ViewChild('verticallyCentered', { static: false }) hello;
  selectedRowSize: number;
  columnDefs: any;
  pagePermission: any;
  addressOptions: any;
  companies: any[];
  invoiceData: any;
  invoiceForm: any;
  companydetails: any;
  gridApi: any;
  company: string;
  selectedGridData: any;
  acceptstatus: any;
  activateModalToggle: boolean = false;
  rejectModalToggle: boolean = false;
  reason = '';
  selectedRole: null;
  today = new Date();
  companydetailS: any[];
  rejectstatus: any;
  @ViewChild('myGrid') grid!: AgGridAngular;
  @ViewChild('myGrid', { static: false }) myGrid: any;
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService,
    private gridService: AgGridService,
    public gridPagination:GridPaginationService
  ) {}

  dateVaidators(AC: AbstractControl) {
    if (
      (new String(AC.value) &&
        new String(AC.value) &&
        !moment(AC.value, 'YYYY-MM-DD', true).isValid()) ||
      new String(AC.value).slice(0, 2) == '00'
    ) {
      return { invalidYear: true };
    }

    return null;
  }

  createForm() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    var todaytime = now.getHours() + ':' + now.getMinutes();
    if (this.company == 'Super Admin') {
      this.saveAdvancePayment = this.formBuilder.group({
        accountno: ['', Validators.required],
        companyname: ['', Validators.required],
        totalamount: ['', Validators.required],
        date: [
          today,
          Validators.compose([Validators.required, this.dateVaidators]),
        ],
        remarks: ['', Validators.required],
      });
    } else {
      this.saveAdvancePayment = this.formBuilder.group({
        accountno: ['', Validators.required],
        companyname: [''],
        totalamount: ['', Validators.required],
        date: [
          today,
          Validators.compose([Validators.required, this.dateVaidators]),
        ],
        remarks: ['', Validators.required],
      });
    }
  }

  clear() {
    this.isEdit = false;
    this.saveAdvancePayment.reset();
    this.createForm();
  }

  getAddressFor(event) {
    let url =
      ServerUrl.live +
      '/esim/getShippingAddressByUserId?userId=' +
      (event.value ? event.value : localStorage.getItem('userName'));
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.addressOptions = res;
      if (this.invoiceData) {
        this.invoiceForm.patchValue({
          address: this.invoiceData.addressid,
        });
      }
    });
  }

  getCompanies() {
    this.loader.presentLoader();
    let url = ServerUrl.live + '/esim/getAllCompanies';
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.companies = res;
    });
  }

  handleActivateModalChange(event: boolean) {
    this.activateModalToggle = event;
  }

  toggleActivateModal(event?) {
    this.activateModalToggle = !this.activateModalToggle;
    this.selectedRole = null;
    if (event?.data.acceptedstatus) {
      this.selectedRole = event.data.acceptedstatus;
    }
    this.selectedGridData = event;
  }

  accepted() {
    let event = this.selectedGridData;
    event.eventPath[0].disabled = true;
    this.acceptstatus = event.eventPath[0].disabled;
    var data;
    data = {
      id: this.selectedGridData.data.id.toString(),
      acceptedstatus: this.acceptstatus.toString(),
      acceptedby: localStorage.getItem('userName'),
    };
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/advancePaymentStatus';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((response) => {
      this.loader.dismissLoader();
      if (response.message == 'Accepted') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: 'This UTR Amount has been Accepted',
        });
        this.getGridData();
        this.toggleActivateModal();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      }
    });
  }

  RejectedModal(event?) {
    this.reason = event.data.rejectedreason;
    this.rejectedModalToggle = event;
  }

  Rejectedtoggle() {
    this.rejectedModalToggle = !this.rejectedModalToggle;
    this.reason = '';
  }

  handleRejectModalChange(event: boolean) {
    this.rejectModalToggle = event;
  }

  toggleRejectModal(event?) {
    this.rejectModalToggle = !this.rejectModalToggle;
    this.reason = '';
    this.selectedRole = null;
    if (event?.data.rejectedstatus) {
      this.selectedRole = event.data.rejectedstatus;
    }
    this.selectedGridData = event;
  }

  rejected() {
    let event = this.selectedGridData;
    event.eventPath[0].disabled = true;
    this.rejectstatus = event.eventPath[0].disabled;
    var data;
    data = {
      id: this.selectedGridData.data.id.toString(),
      rejectedstatus: this.rejectstatus.toString(),
      rejectedby: localStorage.getItem('userName'),
      rejectedreason: this.reason,
    };
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/rejectPayment';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((response) => {
      this.loader.dismissLoader();
      if (response.message == 'Rejected payment') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: 'This UTR Amount was been Rejected',
        });
        this.getGridData();
        this.toggleRejectModal();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      }
    });
  }

  handleYear(event: boolean) {
    this.endisYear = event;
  }

  save(isSave) {
    let formDate = this.saveAdvancePayment.value.date.split('-');
    let isForward = false;
    if ((formDate[0] as number) > this.today.getFullYear()) {
      isForward = true;
    }
    if ((formDate[2] as number) > this.today.getDate()) {
      isForward = true;
    }
    if ((formDate[1] as number) > (this.today.getMonth() as number) + 1) {
      isForward = true;
    }
    if (isForward) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'The selected date must be on or before today.',
      });
      return;
    }

    let datas = this.companies.filter(
      (f) => f.companyname == this.saveAdvancePayment.value.companyname
    );
    this.companydetails = datas[0];

    var data;
    if (isSave == 'save') {
      data = {
        id: '',
        utrno: this.saveAdvancePayment.value.accountno,
        customerid: this.pagePermission.orderforcompany.value
          ? this.companydetails.companyid
          : localStorage['userName'],
        totalamount: this.saveAdvancePayment.value.totalamount.toString(),
        paymentdate: this.saveAdvancePayment.value.date,
        remarks: this.saveAdvancePayment.value.remarks,
        createdby: localStorage.getItem('userName'),
      };
    } else {
      data = {
        id: this.editData.id.toString(),
        utrno: this.saveAdvancePayment.value.accountno,
        customerid: this.pagePermission.orderforcompany.value
          ? this.companydetails.companyid
          : localStorage['userName'],
        totalamount: this.saveAdvancePayment.value.totalamount.toString(),
        paymentdate: this.saveAdvancePayment.value.date,
        remarks: this.saveAdvancePayment.value.remarks,
        createdby: localStorage.getItem('userName'),
      };
    }
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/saveAdvancePayment';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((response) => {
      this.loader.dismissLoader();
      if (response.message == 'Advance payment saved successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });

        this.clear();
        this.getGridData();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      }
    });
  }

  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  rowData = [];
  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }
  getGridData() {
    this.loader.presentLoader();
    var url =
      ServerUrl.live +
      '/esim/getAllAdvancePayment?userId=' +
      localStorage.getItem('userName')+"&page="+this.gridPagination.currentPage;
      if(this.gridPagination.isSearched){
        url=url+"&Search="+this.gridPagination.searchTerm;
      }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      var countUrl="/esim/getAllCountAdvancePayment?userId="+localStorage.getItem('userName');
      if(this.gridPagination.isSearched){
        countUrl=countUrl+"&Search="+this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      setTimeout(() => {
        this.gridService.autoSizeColumns(this.gridApi);
      }, 0);
      this.loader.dismissLoader();
    });
  }
  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData();
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
    this.clear();
  }

  makeCellClicked(e) {
    this.clear();
    if (this.visible == false) {
      this.visible = true;
    }
    // Assuming the input format is dd-mm-yyyy

    // Split the date string and reorder the parts
    this.editData = e.data;

    let data = this.companies.filter(
      (f) => f.companyname == this.editData.customername
    );
    this.companydetails = data[0];

    this.saveAdvancePayment.patchValue({
      accountno: e.data.utrno,
      companyname: this.companydetails.companyname,
      totalamount: e.data.totalamount,
      remarks: e.data.remarks,
      date: e.data.paymentdate,
    });

    this.isEdit = true;
  }

  handleConfirm(event) {
    this.editData = event.data;
    this.endisConfirm = event;
  }
  toggleConfirm() {
    this.endisConfirm = !this.endisConfirm;
  }

  delete() {
    this.loader.presentLoader();
    const url =
      ServerUrl.live +
      '/esim/deleteAdvancePayment?id=' +
      this.editData.id +
      '&deletedby=' +
      localStorage.getItem('userName');
    this.ajaxService.ajaxdelete(url).subscribe((response) => {
      this.loader.dismissLoader();
      if (response.message == 'Advance payment deleted successfully') {
        this.loader.presentLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.editData = '';
        this.selectedMonth = '';
        this.toggleConfirm();
        this.getGridData();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      }
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
      title: 'Esim Advance Payment',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  ngOnInit(): void {
    this.createForm();
    this.getCompanies();
    this.company = localStorage.getItem('usertype');

    this.maxDate = this.today.getFullYear() + '-';
    this.maxDate +=
      (this.today.getMonth() + 1 < 10
        ? '0' + (this.today.getMonth() + 1).toString()
        : (this.today.getMonth() + 1).toString()) + '-';
    this.maxDate +=
      this.today.getDate() < 10
        ? '0' + this.today.getDate().toString()
        : this.today.getDate().toString();
    this.pagePermission =
      this.permission.getPermissionDetails('Advance Payment');
    this.columnDefs = [
      {
        headerName: 'Customer Name',
        field: 'customername',
        filter: 'agTextColumnFilter',
        width: 240,
      },
      {
        headerName: 'UTR No',
        field: 'utrno',
        filter: 'agTextColumnFilter',
        width: 240,
      },
      {
        headerName: 'Transaction Date',
        field: 'paymentdate',
        filter: 'agTextColumnFilter',
        width: 240,
      },
      {
        headerName: 'Total Amount',
        field: 'totalamount',
        filter: 'agTextColumnFilter',
        width: 240,
      },
      {
        headerName: 'Used Amount',
        field: 'usedamount',
        filter: 'agTextColumnFilter',
        width: 240,
      },
      {
        headerName: 'Balance Amount',
        field: 'balanceamount',
        filter: 'agTextColumnFilter',
        width: 240,
      },
      {
        headerName: 'Status',
        field: 'status',
        filter: 'agTextColumnFilter',
        width: 150,
      },
    ];
    if (this.company == 'SuperAdmin') {
      this.columnDefs.push({
        width: 150,
        cellRenderer: disableableButtonRenderer,
        cellRendererParams: {
          text: 'status',
        },

        onCellClicked: (params) => {
          if (params.data.acceptedstatus != true) {
            this.toggleActivateModal(params);
          }
        },
        sortable: false,
      });
    }

    if (this.company == 'SuperAdmin') {
      this.columnDefs.push({
        width: 150,
        cellRenderer: disableableButtonRenderer,
        cellRendererParams: {
          text: 'rejectstatus',
        },

        onCellClicked: (params) => {
          if (params.data.rejectedstatus != true) {
            this.toggleRejectModal(params);
          }
        },
        sortable: false,
      });
    }

    this.columnDefs.push({
      width: 190,
      cellRenderer: disableableButtonRenderer,
      cellRendererParams: {
        text: 'Rejected Reason',
      },
      onCellClicked: this.RejectedModal.bind(this),
      sortable: false,
    });

    this.columnDefs.push({
      width: 100,
      cellRenderer: disableableButtonRenderer,
      cellRendererParams: {
        text: 'Edit',
      },
      onCellClicked: (params) => {
        this.makeCellClicked(params);
      },
      sortable: false,
    });

    this.columnDefs.push({
      width: 110,
      cellRenderer: disableableButtonRenderer,
      cellRendererParams: {
        text: 'Delete',
      },
      onCellClicked: (params) => {
        this.handleConfirm(params);
      },
    });
    this.getGridData();
  }
}
