import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { LoaderService } from 'src/app/service/loader.service';
import { ServerUrl } from 'src/environment';
import { GridApi, ICellRendererParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { PermissionService } from 'src/app/service/permission.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
import { GridPaginationService } from 'src/app/service/grid-pagination.service';

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
  imports: [CommonModule],
  standalone: true,
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
    if (this.params.text == 'status') {
      if (this.params.data.postatus == 'Accepted') {
        this.button.nativeElement.disabled = true;
      } else {
        this.button.nativeElement.disabled = false;
      }
    } else {
      if (this.params.data.shippingstaus == 'Shipped') {
        this.button.nativeElement.disabled = true;
      } else {
        this.button.nativeElement.disabled = false;
      }
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
  selector: 'app-esim-purchase-details',
  templateUrl: './esim-purchase-details.component.html',
  styleUrls: ['./esim-purchase-details.component.scss'],
})
export class EsimPurchaseDetailsComponent {
  rowData: any;
  gridApi: any;
  selectedRows: any[] = [];
  selectedRowSize: any;
  defaultColDef = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  columnDefs: {
    headerName: string;
    field: string;
    width: number;
    filter: string;
  }[];
  activateModalToggle: any = false;
  plan: string;
  @ViewChild('myGrid', { static: false }) myGrid: any;
  plans = [
    {
      planValue: '1 Year',
      years: '1 Year',
    },
    {
      planValue: '2 Year',
      years: '2 Year',
    },
    // {
    //   planValue: '3 Year',
    //   years: '3 Year',
    // },
  ];
  pagePermissions: any;
  columnApi: any;
  generateInvoiceModalToggle: boolean = false;
  activationForm: FormGroup;
  visible: boolean = false;
  invoicegrid: any;
  editfilter: any;
  selectedimei: any[];
  selctedproductname: any;
  endisConfirm: boolean = false;
  editData;
  invoicedata: any;
  date: string;
  customerid: any;
  dealer: any;
  cavalidityperiod: string;
  activateModalLoader: boolean = false;
  generateInvoiceModalLoader: boolean;
  firstAttempt: boolean = false;

  constructor(
    private loader: LoaderService,
    private ajaxService: AjaxService,
    private messageService: MessageService,
    private permission: PermissionService,
    private excel: ExportExcelService,
    private gridService: AgGridService,
    public gridPagination:GridPaginationService
  ) {}

  handleActivateModalChange(event: boolean) {
    this.activateModalToggle = event;
    if (!this.activateModalToggle && (this.firstAttempt==true)){ 
      this.gridApi?.api.deselectAll();
    } 
    this.firstAttempt=true;
  }

  toggleActivateModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length > 1) {
      const firstPONumber = this.selectedRows[0].pono;
      for (let i = 1; i < this.selectedRows.length; i++) {
        if (firstPONumber !== this.selectedRows[i].pono) {
          this.messageService.add({
            key: 'toast1',
            severity: 'warn',
            summary: 'Warning',
            detail:
              'The selected PO Numbers are different. Please select rows with the same PO Number.',
          });
          this.activateModalToggle = false;
          return;
        }
      }
    }

    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail:
          'Select a purchase Order to request for Commercial Activation!!',
      });
      this.activateModalToggle = false;
      return;
    }
    if (!this.activateModalToggle) {
      this.activateModalLoader = true;
      setTimeout(() => {
        this.activateModalToggle = true;
      }, 200);
    } else {
      this.activateModalToggle = !this.activateModalToggle;
    }
    this.plan = '';
  }

  // toggleActivateModal() {
  //   let selectedRows = this.gridApi.api.getSelectedRows();
  //   let isSameDealerId = true;

  //   if (selectedRows.length > 1) {
  //     this.activateModalToggle = !this.activateModalToggle;
  //     const firstPONumber = selectedRows[0].pono;

  //     for (let i = 1; i < selectedRows.length; i++) {
  //       if (firstPONumber !== selectedRows[i].pono) {
  //         isSameDealerId = false;
  //         break;
  //       }
  //     }

  //     if (!isSameDealerId) {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'warn',
  //         summary: 'Warning',
  //         detail:
  //           'The selected PO Numbers are different. Please select rows with the same PO Number.',
  //       });
  //       this.activateModalToggle = false;
  //       return;
  //     }
  //   } else if (this.selectedRows.length < 1) {
  //     this.messageService.add({
  //       key: 'toast1',
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail:
  //         'Select a purchase Order to request for Commercial Activation!!',
  //     });
  //     this.activateModalToggle = false;
  //     return;
  //   }

  //   this.activateModalToggle = !this.activateModalToggle;
  //   this.plan = '';
  //   if (!this.activateModalToggle) this.gridApi?.api.deselectAll();
  // }

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
      title: 'Esim Purchase Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  onGridReady(params) {
    this.gridApi = params;
    this.getGridData();
  }

  getGridData() {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/getAllEsimCustomerPurchase?customerid=' +
      localStorage.getItem('userName')+"&page="+this.gridPagination.currentPage;
    if(this.gridPagination.isSearched){
      url=url+"&Search="+this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      let countUrl="/esim/getAllCountEsimCustomerPurchase?customerid="+localStorage.getItem('userName');
      if(this.gridPagination.isSearched){
        countUrl=countUrl+"&Search="+this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      setTimeout(() => {
        this.gridService.autoSizeColumns(this.gridApi);
      }, 1);
      this.loader.dismissLoader();
    });
  }

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData();
  }

  requestForCA() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    let requestBody = [];
    this.selectedRows.map((row) => {
      requestBody.push({
        id: '',
        primaryiccidno: row.primaryiccid,
        fallbackiccidno: row.fallbackiccid,
        requestedcompany: JSON.parse(localStorage.getItem('loginData'))
          .companyname,
        validityperiod: this.plan,
        createdby: localStorage.getItem('userName'),
        createddate: today,
      });
    });
    this.cavalidityperiod = this.plan;
    let url = ServerUrl.live + '/esim/saveCARequest';
    this.loader.presentLoader();
    this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
      if (res.message == 'CA Request saved successfully') {
        this.PendingInvoice();
        this.toggleActivateModal();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: res.message,
        });
      }
      this.loader.dismissLoader();
    });
  }

  PendingInvoice() {
    let data = [];
    this.selectedRows.map((row) => {
      data.push({
        primaryiccidno: row.primaryiccid,
        cardstatus: 'New Sim',
      });
      this.dealer = this.selectedRows[0].companyname;
    });

    this.loader.presentLoader();

    let datas = this.rowData.filter(
      (d) => d.primaryiccid == data[0].primaryiccidno
    );
    this.customerid = datas[0];
    let url =
      ServerUrl.live +
      '/esim/getpendinginvoice?customerid=' +
      this.customerid.customerid +
      '&validityperiod=' +
      this.cavalidityperiod;
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      this.invoicedata = res;

      this.toggleGenearteInvoiceModal();
      this.loader.dismissLoader();
    });
  }

  toggleGenearteInvoiceModal() {
    if (!this.generateInvoiceModalToggle) {
      this.generateInvoiceModalLoader = !this.generateInvoiceModalToggle;
      setTimeout(
        () =>
          (this.generateInvoiceModalToggle = !this.generateInvoiceModalToggle),
        200
      );
    } else {
      this.generateInvoiceModalToggle = !this.generateInvoiceModalToggle;
    }
    this.plan = '';
    this.visible = false;
    this.getGridData();

    this.invoicegrid = [
      {
        headerName: 'Primary ICCID',
        field: 'primaryiccid',
        width: 250,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Validity Period',
        field: 'validity',
        width: 160,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Product Name',
        field: 'productname',
        width: 350,
        filter: 'agTextColumnFilter',
      },
      // {
      //   headerName: 'Purchase Rate',
      //   field: 'purchaserate',
      //   width: 140,
      //   filter: 'agTextColumnFilter',
      // },
      {
        headerName: 'Activation Payment',
        field: 'productprice',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        width: 180,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Delete',
        },
        onCellClicked: (params) => {
          if (this.invoicedata.length != 1) {
            this.handleConfirm(params);
          } else {
            this.messageService.add({
              key: 'toast1',
              severity: 'warn',
              summary: 'Warning',
              detail:
                'You Cannot delete all the Primary ICCID, At least One Should be Mandatory',
            });
          }
        },
        sortable: false,
      },
    ];
  }

  selectedRowColumnDefs: any[] = [
    {
      headerName: 'Purchase Order',
      field: 'pono',
      width: 250,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID',
      field: 'primaryiccid',
      width: 300,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Purchased By',
      field: 'companyname',
      width: 250,
      filter: 'agTextColumnFilter',
    },
  ];

  handleConfirm(event) {
    this.editData = event.data;
    this.endisConfirm = event;
  }

  toggleConfirm() {
    this.endisConfirm = !this.endisConfirm;
  }
  delete() {
    this.invoicedata = this.invoicedata.filter(
      (item) => item.primaryiccid != this.editData.primaryiccid
    );
    this.endisConfirm = false;
    this.visible = false;
  }

  dismiss() {
    this.visible = false;
  }
  GenerateInvoice() {
    let data = [];
    this.invoicedata.map((row) => {
      data.push({
        stockowner: row.customerid,
        primaryiccidno: row.primaryiccid,
        invoiceno: this.customerid.invoiceid,
        fallbackiccidno: this.customerid.fallbackiccid,
        cardstatus: 'New Sim',
        productid: row.zohoproductid,
        productname: row.productname,
        purchaserate: parseInt(row.purchaserate),
        rate: parseInt(row.productprice),
        description: row.description,
        validityperiod: row.validity,

        pagename: 'CA',
      });
    });

    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/saveZohoCAInvoiceHeader?headerid=&stockowner=' +
      this.invoicedata[0].customerid +
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
        this.getGridData();
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
  }

  ngOnInit() {
    this.getGridData();
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.date = today;
    const isSuperAdmin =
      localStorage.getItem('userName') === 'superadmin@gmail.com';
    this.pagePermissions =
      this.permission.getPermissionDetails('Purchase Details');
    let dynamicColumnDefs = [
      {
        headerName: 'Company Name',
        field: 'companyname',
        width: 190,
        filter: 'agTextColumnFilter',
        checkboxSelection: true,
      },
      {
        headerName: 'Purchase Order',
        field: 'pono',
        width: 190,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'PO Date',
        field: 'purchasedon',
        width: 190,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Invoice No',
        field: 'invoiceid',
        width: 190,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Primary ICCID',
        field: 'primaryiccid',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Primary TSP',
        field: 'primarytsp',
        width: 150,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Primary MSISDN',
        field: 'primarymsisdn',
        width: 170,
        filter: 'agTextColumnFilter',
      },

      {
        headerName: 'Card State',
        field: 'cardstate',
        width: 150,
        filter: 'agTextColumnFilter',
      },

      {
        headerName: 'Fallback ICCID',
        field: 'fallbackiccid',
        width: 150,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Fallback TSP',
        field: 'fallbacktsp',
        width: 150,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Fallback MSISDN',
        field: 'fallbackmsisdn',
        width: 170,
        filter: 'agTextColumnFilter',
      },
    ];
    if (isSuperAdmin) {
      dynamicColumnDefs.push({
        headerName: 'Purchased By',
        field: 'purchasedby',
        width: 150,
        filter: 'agTextColumnFilter',
      });
    }
    this.columnDefs = dynamicColumnDefs;
    // this.gridApi?.api.addEventListener(
    //   'selectionChanged',
    //   this.onSelectionChanged.bind(this)
    // );
  }

  // onSelectionChanged() {
  //   const selectedNodes = this.gridApi?.api.getSelectedNodes();
  //   if (selectedNodes.length > 0) {
  //     const selectedPurchaseOrder = selectedNodes[0].data.pono;

  //     const differentPurchaseOrder = selectedNodes.some(
  //       (node) => node.data.pono !== selectedPurchaseOrder
  //     );

  //     if (differentPurchaseOrder) {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Please select rows with the same purchase order.',
  //       });
  //     }
  //   }
  // }
}
