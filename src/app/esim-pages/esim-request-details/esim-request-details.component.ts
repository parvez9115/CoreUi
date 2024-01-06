import { Component, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { LoaderService } from 'src/app/service/loader.service';
import { ServerUrl } from 'src/environment';
import { EsimCaRequestComponent } from '../esim-requests/esim-ca-request/esim-ca-request.component';
import { EsimRenewalRequestComponent } from '../esim-requests/esim-renewal-request/esim-renewal-request.component';
import { EsimTopupDetailsComponent } from '../esim-topup-details/esim-topup-details.component';
import { EsimTopupRequestComponent } from '../esim-requests/esim-topup-request/esim-topup-request.component';
import { EsimExtendValidityRequestComponent } from '../esim-requests/esim-extend-validity-request/esim-extend-validity-request.component';
import { MessageService } from 'primeng/api';
import { PermissionService } from 'src/app/service/permission.service';
import { AgGridService } from 'src/app/service/ag-grid-service.service';

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
  selector: 'app-esim-request-details',
  templateUrl: './esim-request-details.component.html',
  styleUrls: ['./esim-request-details.component.scss'],
})
export class EsimRequestDetailsComponent implements OnInit {
  rowData: any = [];
  tabs: any;
  activeTab: any;
  selectedRowSize: any;
  gridUrl: string;
  detailsUrl: string;
  defaultColDef = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };
  @ViewChild('myGrid') myGrid: any;
  @ViewChild('detailsGrid') detailsGrid: any;
  gridButtons = [];
  detailsGridModal: boolean = null;
  endisConfirm: boolean = false;
  editData;
  detailsRowData: any;
  detailsColumnDefs: any = [];
  columnDefs: any = [];
  caRequestColumns = [
    {
      headerName: 'CA Request ID',
      field: 'carequestid',
      width: 170,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Date',
      field: 'carequestdate',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Pending Quantity',
      field: 'pendingquantity',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Request Quantity',
      field: 'totalrequestedquantity',
      width: 200,
      filter: 'agTextColumnFilter',
    },
  ];
  renewalRequestColumns = [
    {
      headerName: 'Renewal Request ID',
      field: 'renewalrequestid',
      width: 180,
      filter: 'agTextColumnFilter',
    },

    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Date',
      field: 'renewalrequestdate',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Pending Quantity',
      field: 'pendingquantity',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Request Quantity',
      field: 'totalrequestedquantity',
      width: 200,
      filter: 'agTextColumnFilter',
    },
  ];
  topupRequestColumns = [
    {
      headerName: 'Topup Request ID',
      field: 'topuprequestid',
      width: 180,
      filter: 'agTextColumnFilter',
    },

    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Date',
      field: 'topuprequestdate',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Pending Quantity',
      field: 'pendingquantity',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Request Quantity',
      field: 'totalrequestedquantity',
      width: 200,
      filter: 'agTextColumnFilter',
    },
  ];
  extendValidityRequestColumns = [
    {
      headerName: 'Extend 1yr Request ID',
      field: 'extendoneyrrequestid',
      width: 190,
      filter: 'agTextColumnFilter',
    },

    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Date',
      field: 'extendoneyrrequestdate',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Pending Quantity',
      field: 'pendingquantity',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Request Quantity',
      field: 'totalrequestedquantity',
      width: 200,
      filter: 'agTextColumnFilter',
    },
  ];
  detailsCAColumn: any = [
    {
      headerName: 'CA Requested ID',
      field: 'carequestid',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID No',
      field: 'primaryiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback ICCID No',
      field: 'fallbackiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'CA Request Date',
      field: 'carequestdate',
      width: 155,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 180,
      filter: 'agTextColumnFilter',
    },

    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
  ];
  detailsRenewalColumn: any = [
    {
      headerName: 'Renewal ID',
      field: 'renewalrequestid',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID No',
      field: 'primaryiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback ICCID No',
      field: 'fallbackiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Renewal Request Date',
      field: 'renewalrequestdate',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 180,
      filter: 'agTextColumnFilter',
    },

    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Previous CA Date',
      field: 'previouscadate',
      width: 180,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Previous Card End Date',
      field: 'previouscardenddate',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Previous Card Status',
      field: 'previouscardstatus',
      width: 200,
      filter: 'agTextColumnFilter',
    },
  ];
  detailsTopupColumn: any = [
    {
      headerName: 'Topup Request ID',
      field: 'topuprequestid',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID No',
      field: 'primaryiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback ICCID No',
      field: 'fallbackiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Topup Request Date',
      field: 'topuprequestdate',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 180,
      filter: 'agTextColumnFilter',
    },

    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
  ];
  detailsExtend1yrColumn: any = [
    {
      headerName: 'Extend Request ID',
      field: 'extendrequestid',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID No',
      field: 'primaryiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback ICCID No',
      field: 'fallbackiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Extend Request Date',
      field: 'extendrequestdate',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 180,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested By',
      field: 'stockowner',
      width: 180,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
  ];
  currentGrid: any;
  pagePermissions: any;
  detailsGridApi: any;
  gridApi: any;
  detailsGridModalLoader: boolean;

  constructor(
    private ajaxService: AjaxService,
    private excel: ExportExcelService,
    private loader: LoaderService,
    private messageService: MessageService,
    private permission: PermissionService,
    private gridService: AgGridService
  ) { }

  toggleConfirm() {
    this.endisConfirm = !this.endisConfirm;
  }

  tabChanged(event) {
    this.rowData = [];
    this.currentGrid = event.label;
    this.gridUrl = event.gridUrl;
    this.detailsUrl = event.detailsUrl;
    this.columnDefs = JSON.parse(JSON.stringify(event.gridColumn));
    this.gridButtons.forEach((buttons) => {
      this.columnDefs.push(buttons);
    });
    this.detailsColumnDefs = event.detailsColumn;
    this.getGridData();
  }

  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }

  getGridData() {
    let url = ServerUrl.live + this.gridUrl;
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      setTimeout(() => {
        this.gridService.autoSizeColumns(this.gridApi);
      }, 0);
      this.loader.dismissLoader();
    });
  }

  getDetailsGridApi(event) {
    this.detailsGridApi = event;
  }
  async onDetailsGridReady(data) {
    let id;
    switch (this.currentGrid) {
      case 'CA Request Details':
        id = data.carequestid;
        break;
      case 'Renewal Request Details':
        id = data.renewalrequestid;
        break;
      case 'Topup Request Details':
        id = data.topuprequestid;
        break;
      case 'Extend Validity Request Details':
        id = data.extendoneyrrequestid;
        break;
    }
    let url = ServerUrl.live + this.detailsUrl + id;
    this.detailsRowData = [];
    this.loader.presentLoader();
    let promise = new Promise((resolve) => {
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.detailsRowData = res;
        this.gridService.autoSizeColumns(this.detailsGridApi);
        this.loader.dismissLoader();
        resolve(res);
      });
    });
    return promise;
  }

  toggleDetailsGridModal(data) {
    this.detailsGridModalLoader = true;
    if (this.detailsGridModal == null) {
      setTimeout(() => {
        this.detailsGridModal = true;
        this.onDetailsGridReady(data.data);
      }, 200);
      return;
    } else {
      this.detailsGridModal = !this.detailsGridModal;
    }
    this.onDetailsGridReady(data.data);
  }
  handleDetailsGridModal(event) {
    this.detailsGridModal = event;
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
      title: 'Esim Request Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  async exportDetails(gridData) {
    let data: any = await this.onDetailsGridReady(gridData.data);
    let coloumnArray = [];

    this.detailsGrid.columnDefs.map((p) => {
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
      title: 'Esim Request Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  handleConfirm(event) {
    this.editData = event.data;
    this.endisConfirm = event;
  }

  delete() {
    let data = this.editData;
    let id;
    let api;
    switch (this.currentGrid) {
      case 'CA Request Details':
        id = data.carequestid;
        api = '/esim/deleteSimCARequestDetails?reqId=';
        break;
      case 'Renewal Request Details':
        id = data.renewalrequestid;
        api = '/esim/deleteSimRRequestDetails?reqId=';
        break;
      case 'Topup Request Details':
        id = data.topuprequestid;
        api = '/esim/deleteSimTopupRequestDetails?reqId=';
        break;
      case 'Extend Validity Request Details':
        id = data.extendoneyrrequestid;
        api = '/esim/deleteSimExtendOneYrRequestDetails?reqId=';
        break;
    }
    let url = ServerUrl.live + api + id;
    this.ajaxService.ajaxdelete(url).subscribe((res) => {
      if (res.message == 'Deleted successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: 'Request Deleted Succesfully!!',
        });
        this.getGridData();
        this.toggleConfirm();
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
    this.pagePermissions = this.permission.getPermissionDetails(
      'Esim Request Details'
    );
    if (this.pagePermissions.viewdetails.value) {
      this.gridButtons.push({
        width: 110,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'View',
        },
        onCellClicked: this.toggleDetailsGridModal.bind(this),
        sortable: false,
      });
    }
    if (this.pagePermissions.download.value) {
      this.gridButtons.push({
        width: 150,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Download',
        },
        onCellClicked: this.exportDetails.bind(this),
        sortable: false,
      });
    }
    // if (this.pagePermissions.remove.value) {
    //   this.gridButtons.push({
    //     width: 130,
    //     cellRenderer: ColourCellRenderer,
    //     cellRendererParams: {
    //       text: 'Delete',
    //     },
    //     onCellClicked: this.handleConfirm.bind(this),
    //     sortable: false,
    //   });
    // }

    this.tabs = [
      {
        label: 'CA Request Details',
        gridUrl: '/esim/simCARequestDetails',
        detailsUrl: '/esim/viewSimCARequestDetails?reqId=',
        gridColumn: this.caRequestColumns,
        detailsColumn: this.detailsCAColumn,
      },
      {
        label: 'Renewal Request Details',
        gridUrl: '/esim/simRRequestDetails',
        detailsUrl: '/esim/viewSimRRequestDetails?reqId=',
        gridColumn: this.renewalRequestColumns,
        detailsColumn: this.detailsRenewalColumn,
      },
      {
        label: 'Topup Request Details',
        gridUrl: '/esim/simTopupRequestDetails',
        detailsUrl: '/esim/viewSimTopupRequestDetails?reqId=',
        gridColumn: this.topupRequestColumns,
        detailsColumn: this.detailsTopupColumn,
      },
      {
        label: 'Extend Validity Request Details',
        gridUrl: '/esim/simExtendOneYrRequestDetails/',
        detailsUrl: '/esim/viewSimExtendOneYrRequestDetails?reqId=',
        gridColumn: this.extendValidityRequestColumns,
        detailsColumn: this.detailsExtend1yrColumn,
      },
    ];
    this.activeTab = this.tabs[0];
    this.currentGrid = this.activeTab.label;
    this.gridUrl = this.activeTab.gridUrl;
    this.detailsUrl = this.activeTab.detailsUrl;
    this.detailsColumnDefs = this.activeTab.detailsColumn;
    this.columnDefs = JSON.parse(JSON.stringify(this.activeTab.gridColumn));
    this.gridButtons.forEach((buttons) => {
      this.columnDefs.push(buttons);
    });
    this.getGridData();
  }
}
