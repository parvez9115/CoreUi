import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { GridApi, ICellRendererParams } from 'ag-grid-community';
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
  selector: 'colour-cell',
  standalone: true,
  template: `<button #button class="button">
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
    if (this.params.data.balanceamount == 0) {
      this.button.nativeElement.disabled = true;
    } else {
      this.button.nativeElement.disabled = false;
    }
  }
  params!: any;
  @ViewChild('button', { static: false }) button: ElementRef;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    this.params = params;
    return true;
  }
}

@Component({
  selector: 'app-topup-invoice',
  templateUrl: './topup-invoice.component.html',
  styleUrls: ['./topup-invoice.component.scss'],
})
export class TopupInvoiceComponent {
  @ViewChild('tabMenu', { static: false }) tabMenu: any;
  @ViewChild('renewProduct', { static: false }) renewalButton: ElementRef;
  @ViewChild('activateProduct', { static: false }) activateButton: ElementRef;
  @ViewChild('myGrid', { static: false }) myGrid: any;
  gridData: any;
  gridApi: GridApi;
  columnpending: any[];
  columninvoice: any[];
  viewiccidgrid: any[];
  viewgrid: any[];
  rowData: any;
  tabs: any = [
    // { label: 'Pending' },
    { label: 'Invoice' },
  ];
  activeTab: any = {};
  isPendingTab: boolean = false;
  selectedRowSize: any;
  selectedRows: any[] = [];
  defaultColDef = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  invoices: any[];
  closeinvoices: any[];
  deleteinvoices: any[];
  color = '';
  closecolor = '';
  deletecolor = '';
  whichgrid = 'Pending';
  ViewModalToggle: boolean = false;
  generateInvoiceModalToggle: boolean = false;
  invoicedetailtoggle: boolean = false;
  viewdata: any;
  gridConfirm: boolean = false;
  editData;
  deleteConfirm: boolean = false;
  deleteData;
  viewiccidpopup: boolean = false;
  restore: boolean = false;
  invoicedata: any[];
  visible: boolean = false;
  dealer;
  selectedimei: any[];
  editfilter: any;
  selctedproductname: any;
  date: string;
  girdvalue: any;
  stockowner: any;
  invoicetabgrid: any;
  headerid: any;
  viewiccid: any;
  invoicedetailgrid = [];
  invoicegrid: any[] = [
    {
      headerName: 'Primary ICCID',
      field: 'primaryiccid',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Validity Period',
      field: 'validity',
      width: 170,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Product Name',
      field: 'productname',
      width: 350,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Purchase Rate',
      field: 'purchaserate',
      width: 140,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Rate',
      field: 'productprice',
      width: 100,
      filter: 'agTextColumnFilter',
    },
    // {
    //   width: 100,
    //   cellRenderer: ColourCellRenderer,
    //   cellRendererParams: {
    //     text: 'Edit',
    //   },
    //   onCellClicked: this.edit.bind(this),
    //   sortable: false,
    // },
    {
      width: 120,
      cellRenderer: ColourCellRenderer,
      cellRendererParams: {
        text: 'Delete',
      },
      onCellClicked: this.handleConfirm.bind(this),
      sortable: false,
    },
  ];

  viewreceivedamountpopup: boolean = false;
  receivedform: FormGroup;
  result: any;
  invoicedetails: any;
  usertype: any;
  username: any;
  ViewModalLoader: boolean;
  viewiccidLoader: boolean;
  invoicedetailLoader: boolean;

  handleViewModalToggle(event) {
    this.ViewModalToggle = event;
  }

  handlegenerateInvoiceModalToggle(event) {
    this.generateInvoiceModalToggle = event;
  }

  handleviewiccidpopup(event) {
    this.viewiccidpopup = event;
  }

  handlereceivedamountpopup(event) {
    this.viewreceivedamountpopup = event;
  }
  handledetailpopup(event) {
    this.invoicedetailtoggle = event;
  }

  constructor(
    private loader: LoaderService,
    private ajaxService: AjaxService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private permission: PermissionService,
    private excel: ExportExcelService,
    private gridService: AgGridService,
    public gridPagination:GridPaginationService
  ) {}

  tabChanged(event) {
    this.isPendingTab = event.label === 'Invoice';
    if (event.label == 'Invoice') {
      this.renewalButton
        ? (this.renewalButton.nativeElement.disabled = false)
        : null;
      this.activateButton
        ? (this.activateButton.nativeElement.disabled = true)
        : null;
      this.activeTab = this.tabs[1];
      this.gridchanges();
    } else if (event.label == 'Pending') {
      this.activeTab = this.tabs[0];
      this.gridchanges();
    }
  }

  pendinginvoicecount() {
    let url =
      ServerUrl.live +
      '/esim/getesimInvoiceCount?pagename=TopUp&status=Pending';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.invoices = res.invoicecount;
      if (res.invoicecount != 0) {
        this.color = 'green';
      } else {
        this.color = 'red';
      }
    });
  }

  closeinvoicecount() {
    let url =
      ServerUrl.live + '/esim/getesimInvoiceCount?pagename=TopUp&status=Close';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.closeinvoices = res.invoicecount;
      if (res.invoicecount != 0) {
        this.closecolor = 'green';
      } else {
        this.closecolor = 'red';
      }
    });
  }

  deleteinvoicecount() {
    let url =
      ServerUrl.live +
      '/esim/getesimInvoiceCount?pagename=TopUp&status=Deleted';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.deleteinvoices = res.invoicecount;
      if (res.invoicecount != 0) {
        this.deletecolor = 'green';
      } else {
        this.deletecolor = 'red';
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params;
    this.loader.presentLoader();
    this.gridchanges();
  }

  gridchanges(value?) {
    if (this.activeTab.label == 'Pending') {
      if (value == undefined) {
        this.whichgrid = 'Pending';
      } else {
        this.whichgrid = value;
      }
      this.loader.presentLoader();
      let url =
        ServerUrl.live +
        '/esim/getinvoicestatus?pagename=TopUp&status=' +
        this.whichgrid;
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.gridData = res;
        this.loader.dismissLoader();
        this.stockowner = this.gridData.map((d) => d.stockowner);
        this.pendinginvoicecount();
        this.closeinvoicecount();
        this.deleteinvoicecount();
        setTimeout(() => {
          this.gridService.autoSizeColumns(this.gridApi);
        }, 0);
        if (this.whichgrid == 'Pending') {
          this.columnpending = [
            {
              headerName: 'Approved ID',
              field: 'approvedid',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Invoice No',
              field: 'invoiceno',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Invoice Date',
              field: 'invoicedate',
              width: 155,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Total Item',
              field: 'Totalitem',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Username',
              field: 'username',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Approved By',
              field: 'approvedby',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Approved Date',
              field: 'approveddate',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              width: 120,
              cellRenderer: ColourCellRenderer,
              cellRendererParams: {
                text: 'View',
              },
              onCellClicked: this.viewpop.bind(this),
              sortable: false,
            },
            {
              width: 200,
              cellRenderer: ColourCellRenderer,
              cellRendererParams: {
                text: 'Generate Invoice',
              },
              onCellClicked: this.PendingInvoice.bind(this),
              sortable: false,
            },
            {
              width: 120,
              cellRenderer: ColourCellRenderer,
              cellRendererParams: {
                text: 'Delete',
              },
              onCellClicked: this.handledeleteConfirm.bind(this),
              sortable: false,
            },
          ];
        } else if (this.whichgrid == 'Close') {
          this.columnpending = [
            {
              headerName: 'Approved ID',
              field: 'approvedid',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Invoice No',
              field: 'invoiceno',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Invoice Date',
              field: 'invoicedate',
              width: 155,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Total Item',
              field: 'Totalitem',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Username',
              field: 'username',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Approved By',
              field: 'approvedby',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Approved Date',
              field: 'approveddate',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              width: 120,
              cellRenderer: ColourCellRenderer,
              cellRendererParams: {
                text: 'View',
              },
              onCellClicked: this.viewpop.bind(this),
              sortable: false,
            },
          ];
        } else if (this.whichgrid == 'Deleted') {
          this.columnpending = [
            {
              headerName: 'Approved ID',
              field: 'approvedid',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Invoice No',
              field: 'invoiceno',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Invoice Date',
              field: 'invoicedate',
              width: 155,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Total Item',
              field: 'Totalitem',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Username',
              field: 'username',
              width: 190,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Approved By',
              field: 'approvedby',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Approved Date',
              field: 'approveddate',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              width: 120,
              cellRenderer: ColourCellRenderer,
              cellRendererParams: {
                text: 'View',
              },
              onCellClicked: this.viewpop.bind(this),
              sortable: false,
            },
            {
              width: 120,
              cellRenderer: ColourCellRenderer,
              cellRendererParams: {
                text: 'Restore',
              },
              onCellClicked: this.restoreConfirm.bind(this),
              sortable: false,
            },
          ];
        }
      });
    } else if (this.activeTab.label == 'Invoice') {
      this.loader.presentLoader();
      let url =
        ServerUrl.live + '/esim/getAllTopupEsimInvoice?userId=' + this.username+"&page="+this.gridPagination.currentPage;
        if(this.gridPagination.isSearched){
          url=url+"&Search="+this.gridPagination.searchTerm;
        }
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.invoicetabgrid = res;
        let countUrl="/esim/getAllCountTopupEsimInvoice?userId="+this.username;
        if(this.gridPagination.isSearched){
          countUrl=countUrl+"&Search="+this.gridPagination.searchTerm;
        }
        this.gridPagination.getTotalRecords(countUrl);
        this.headerid = this.invoicetabgrid.map((d) => d.headerid);
        setTimeout(() => {
          this.gridService.autoSizeColumns(this.gridApi);
        }, 0);
        this.loader.dismissLoader();
        this.columninvoice = [
          {
            headerName: 'Company Name',
            field: 'companyname',
            filter: 'agTextColumnFilter',
            width: 200,
          },
          {
            headerName: 'Customer Id',
            field: 'stockowner',
            width: 190,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Invoice No',
            field: 'invoiceno',
            width: 190,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Invoice Date',
            field: 'invoicedate',
            width: 155,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Invoice Amount',
            field: 'invoiceamount',
            width: 180,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Total Amount Received',
            field: 'totalamountreceived',
            width: 220,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Balance Amount',
            field: 'balanceamount',
            width: 180,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'No of Units',
            field: 'noofunits',
            width: 150,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Created by',
            field: 'createdby',
            width: 190,
            filter: 'agTextColumnFilter',
          },
          // {
          //   width: 100,
          //   cellRenderer: ColourCellRenderer,
          //   cellRendererParams: {
          //     text: 'Edit',
          //   },
          //   onCellClicked: this.editinvoice.bind(this),
          //   sortable: false,
          // },
          {
            width: 120,
            cellRenderer: ColourCellRenderer,
            cellRendererParams: {
              text: 'Invoice',
            },
            onCellClicked: this.Download.bind(this),
            sortable: false,
          },
          {
            width: 140,
            cellRenderer: ColourCellRenderer,
            cellRendererParams: {
              text: 'View ICCID',
            },
            onCellClicked: this.viewiccicd.bind(this),
            sortable: false,
          },
        ];
        if (this.usertype == 'SuperAdmin') {
          this.columninvoice.push(
            {
              width: 165,
              cellRenderer: disableableButtonRenderer,
              cellRendererParams: {
                text: 'Received Amt',
              },
              onCellClicked: (params) => {
                if (params.data.balanceamount != 0) {
                  this.receivedamount(params);
                }
              },
            },
            {
              width: 125,
              cellRenderer: ColourCellRenderer,
              cellRendererParams: {
                text: 'Details',
              },
              onCellClicked: this.details.bind(this),
              sortable: false,
            }
          );
        }
      });
    }
  }

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.gridchanges();
  }

  editinvoice(value) {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/geteditinvoicedetail?invoiceno=' +
      value.data.invoiceno +
      '&invoicedate=' +
      value.data.invoicedate +
      '&cardstatus=TopUp';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.invoicedata = res;
      this.loader.dismissLoader();
      this.toggleGenearteInvoiceModal();
    });
  }

  async Download(value) {
    if (value.data.uploadinvoice != null) {
      const link = document.createElement('a');
      link.href = value.data.uploadinvoice;
      link.target = '_blank';
      link.click();
    } else {
      this.messageService.add({
        key: 'toast1',
        severity: 'success',
        summary: 'Success',
        detail: 'Invoice Document Not Uploaded',
      });
    }
  }

  toggleviewiccicdModel() {
    if (!this.viewiccidpopup) {
      this.viewiccidLoader = !this.viewiccidpopup;
      setTimeout(() => this.viewiccidpopup = !this.viewiccidpopup, 200);
    } else {
      this.viewiccidpopup = !this.viewiccidpopup;
    }
  }
  togglereceivedamountModel() {
    this.viewreceivedamountpopup = !this.viewreceivedamountpopup;
  }

  receivedamount(event) {
    this.togglereceivedamountModel();
    this.receivedform.patchValue({
      companyname: event.data.stockowner,
      invoiceno: event.data.invoiceno,
      invoicedate: event.data.invoicedate,
      totalamount: event.data.invoiceamount,
    });
    this.result = event.data;
  }

  createForm() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    var todaytime = now.getHours() + ':' + now.getMinutes();
    this.receivedform = this.formbuilder.group({
      companyname: ['', Validators.required],
      invoiceno: ['', Validators.required],
      invoicedate: ['', Validators.required],
      totalamount: ['', Validators.required],
      receiveddate: [today, Validators.required],
    });
    this.receivedform.get('companyname').disable();
    this.receivedform.get('invoiceno').disable();
    this.receivedform.get('invoicedate').disable();
    this.receivedform.get('totalamount').disable();
    this.receivedform.get('receiveddate').disable();
  }

  submit() {
    let requestBody;
    let splitedDate = this.date.split('-');
    let date = splitedDate[2] + '-' + splitedDate[1] + '-' + splitedDate[0];

    requestBody = {
      headerid: this.result.headerid.toString(),
      receiveddate: date,
      receivedamount: this.receivedform.value.totalamount.toString(),
      createdby: localStorage.getItem('userName'),
    };
    this.loader.presentLoader();
    let url = ServerUrl.live + '/esim/saveTopupInvoiceDetails';

    this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
      this.loader.dismissLoader();
      if (res.message == 'Topup Amount has been Received Successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.togglereceivedamountModel();
        this.gridchanges();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'warning',
          detail: res.message,
        });
      }
    });
  }

  toggleinvoiceModel() {
    if (!this.invoicedetailtoggle) {
      this.invoicedetailLoader = !this.invoicedetailtoggle;
      setTimeout(() => this.invoicedetailtoggle = !this.invoicedetailtoggle, 200);
    } else {
      this.invoicedetailtoggle = !this.invoicedetailtoggle;
    }
  }

  details(event) {
    this.toggleinvoiceModel();
    let url =
      ServerUrl.live +
      '/esim/getTopupInvoiceDetails?invoiceno=' +
      event.data.invoiceno;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.invoicedetails = res;
    });
    this.invoicedetailgrid = [
      {
        headerName: 'UTR No',
        field: 'utrno',
        width: 190,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Invoice No',
        field: 'invoiceno',
        width: 190,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Received Date',
        field: 'receiveddate',
        width: 170,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Received Amount',
        field: 'receivedamount',
        width: 170,
        filter: 'agTextColumnFilter',
      },
    ];
  }

  viewiccicd(value?) {
    this.toggleviewiccicdModel();
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/getviewinvoicedetail?invoiceno=' +
      value.data.invoiceno +
      '&cardstatus=TopUp';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.viewiccid = res;
      this.loader.dismissLoader();
      this.viewiccidgrid = [
        {
          headerName: 'Invoice No',
          field: 'invoiceno',
          width: 250,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Primary ICCID',
          field: 'primaryiccid',
          width: 500,
          filter: 'agTextColumnFilter',
        },

        // {
        //   width: 120,
        //   cellRenderer: ColourCellRenderer,
        //   cellRendererParams: {
        //     text: 'Remove',
        //   },
        //   onCellClicked: this.removeinvoice.bind(this),
        //   sortable: false,
        // },
      ];
    });
  }

  removeinvoice(value) {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/removeInvoiceICCID?invoiceno=' +
      value.data.invoiceno +
      '&primaryiccid=' +
      value.data.primaryiccid +
      '&cardstatus=TopUp';
    this.ajaxService.ajaxdelete(url).subscribe((res) => {
      if (res.message == 'ICCID Removed Successfully') {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.toggleviewiccicdModel();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      }
    });
  }

  toggleviewModel() {
    if (!this.ViewModalToggle) {
      this.ViewModalLoader = !this.ViewModalToggle;
      setTimeout(() => this.ViewModalToggle = !this.ViewModalToggle, 200);
    } else {
      this.ViewModalToggle = !this.ViewModalToggle;
    }
  }

  viewpop(viewdata) {
    this.toggleviewModel();
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/getinvoicedetails?approvedid=' +
      viewdata.data.approvedid;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.viewdata = res;
      this.loader.dismissLoader();
    });
    this.viewgrid = [
      {
        headerName: 'Primary ICCID',
        field: 'primaryiccid',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Validity Period',
        field: 'validity',
        width: 170,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Product Id',
        field: 'zohoproductid',
        width: 190,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Product Name',
        field: 'productname',
        width: 300,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Purchase Rate',
        field: 'purchaserate',
        width: 170,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Rate',
        field: 'productprice',
        width: 150,
        filter: 'agTextColumnFilter',
      },
    ];
  }

  PendingInvoice(d?) {
    this.girdvalue = d.data;
    let url =
      ServerUrl.live +
      '/esim/getinvoicedetails?approvedid=' +
      this.girdvalue.approvedid;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.invoicedata = res;
      this.toggleGenearteInvoiceModal();
    });
  }

  toggleGenearteInvoiceModal() {
    this.generateInvoiceModalToggle = !this.generateInvoiceModalToggle;
    this.visible = false;
    this.gridchanges();
  }

  GenerateInvoice() {
    if (this.activeTab.label == 'Pending') {
      if (this.invoicedata.length != 0) {
        let data = [];
        this.invoicedata.map((row) => {
          data.push({
            primaryiccidno: row.primaryiccid,
            cardstatus: 'TopUp',
            productid: row.zohoproductid,
            productname: row.productname,
            purchaserate: parseInt(row.purchaserate),
            rate: parseInt(row.productprice),
            description: row.description,
            validityperiod: row.validity,
            pagename: 'TopUp',
          });
        });

        this.loader.presentLoader();
        let url =
          ServerUrl.live +
          '/esim/saveZohoTopupInvoiceHeader?headerid=&stockowner=' +
          this.stockowner[0] +
          '&invoicedate=' +
          this.date +
          '&noofunits=' +
          this.invoicedata.length +
          '&createdby=' +
          localStorage.getItem('userName') +
          '&approveid=' +
          this.girdvalue.approvedid;
        this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
          this.loader.dismissLoader();
          if (res.message == 'Requested Invoice Details Saved Successfully') {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            this.gridchanges();
            this.toggleGenearteInvoiceModal();
          } else {
            this.messageService.add({
              key: 'toast1',
              severity: 'warn',
              summary: 'Warning',
              detail: res.message,
            });
          }
        });
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please Select the atleast any one Primary ICCID',
        });
      }
    } else if (this.activeTab.label == 'Invoice') {
      if (this.invoicedata.length != 0) {
        let data = [];
        this.invoicedata.map((row) => {
          data.push({
            headerid: this.headerid[0],
            primaryiccidno: row.primaryiccid,
            cardstatus: 'TopUp',
            productid: row.zohoproductid,
            productname: row.productname,
            purchaserate: parseInt(row.purchaserate),
            rate: parseInt(row.productprice),
            description: row.description,
            validityperiod: row.validity,
            pagename: 'TopUp',
          });
        });

        this.loader.presentLoader();
        let url =
          ServerUrl.live +
          '/esim/saveZohoTopupInvoiceHeader?headerid=&stockowner=' +
          this.stockowner[0] +
          '&invoicedate=' +
          this.date +
          '&noofunits=' +
          this.invoicedata.length +
          '&createdby=' +
          localStorage.getItem('userName');
        this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
          this.loader.dismissLoader();
          if (res.message == 'Requested Invoice Details Saved Successfully') {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            this.gridchanges();
            this.toggleGenearteInvoiceModal();
          } else {
            this.messageService.add({
              key: 'toast1',
              severity: 'warn',
              summary: 'Warning',
              detail: res.message,
            });
          }
        });
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please Select the atleast any one Primary ICCID',
        });
      }
    }
  }

  edit(d) {
    let url =
      ServerUrl.live +
      '/esim/getAllProductDetail?userId=' +
      localStorage.getItem('userName');
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.editfilter = res;
      this.visible = true;
      this.selectedimei = d.data.primaryiccid;

      let data = this.editfilter.filter(
        (f) => f.productname == d.data.productname
      );
      this.selctedproductname = data[0].productname;
    });
  }

  save() {
    const selectedProductDetails = this.editfilter.find(
      (product) => product.productname === this.selctedproductname
    );
    const editedRow = this.invoicedata.find(
      (row) => row.primaryiccid == this.selectedimei
    );
    if (editedRow) {
      editedRow.zohoproductid = selectedProductDetails.zohoproductid;
      editedRow.productname = selectedProductDetails.productname;
      editedRow.productprice = selectedProductDetails.customerprice;
      editedRow.purchaserate = selectedProductDetails.purchaserate;
      editedRow.description = selectedProductDetails.description;
    }
    let replacingData = this.invoicedata.map((row) => {
      if (row.primaryiccid == this.selectedimei) {
        row = editedRow;
      }
      return row;
    });
    this.invoicedata = replacingData;
    this.visible = false;
  }

  handleConfirm(event) {
    this.editData = event.data;
    this.gridConfirm = event;
  }

  dismiss() {
    this.visible = false;
  }

  toggleConfirm() {
    this.gridConfirm = !this.gridConfirm;
  }

  deletegird() {
    this.invoicedata = this.invoicedata.filter(
      (item) => item.primaryiccid != this.editData.primaryiccid
    );
    this.gridConfirm = false;
    this.visible = false;
  }

  handledeleteConfirm(event) {
    this.deleteData = event.data;
    this.deleteConfirm = event;
  }

  toggledeleteConfirm() {
    this.deleteConfirm = !this.deleteConfirm;
  }

  deleteinvoice() {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/deletependinginvoice?approvedid=' +
      this.deleteData.approvedid +
      '&username=' +
      localStorage.getItem('userName');
    this.ajaxService.ajaxdelete(url).subscribe((res) => {
      this.loader.dismissLoader();
      if (res.message == 'Pending Invoice Deleted Successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.gridchanges();
        this.toggledeleteConfirm();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      }
    });
  }

  restoreConfirm(event) {
    this.deleteData = event.data;
    this.restore = event;
  }

  togglerestoreConfirm() {
    this.restore = !this.restore;
  }

  Restore() {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/deleterestoreinvoice?approvedid=' +
      this.deleteData.approvedid +
      '&username=' +
      localStorage.getItem('userName');
    this.ajaxService.ajaxdelete(url).subscribe((res) => {
      this.loader.dismissLoader();
      if (res.message == 'Deleted Invoice Restored Successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.gridchanges();
        this.togglerestoreConfirm();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      }
    });
  }

  export() {
    let data = this.invoicetabgrid;
    let coloumnArray = [];

    this.myGrid.columnDefs.map((p) => {
      coloumnArray.push(p.field);
    });

    for (let i = 0; i < data.length; i++) {
      let k = Object.keys(data[i]);
      for (let j = 0; j < k.length; j++) {
        if (
          coloumnArray.includes(k[j]) == false ||
          k[j].includes('stockowner')
        ) {
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
      title: 'Topup Invoice Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  ngOnInit() {
    this.username = localStorage.getItem('userName');
    this.usertype = localStorage.getItem('usertype');
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.date = today;
    let companyinfo;
    companyinfo = JSON.parse(localStorage.getItem('loginData'));
    this.dealer = companyinfo.companyname;
    this.activeTab = this.tabs[0];
    this.createForm();
  }
}
