import {
  AfterViewInit,
  Component,
  ElementRef,
  Injectable,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { Grid, GridApi, ICellRendererParams } from 'ag-grid-community';
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

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-esim-ca-request',
  templateUrl: './esim-ca-request.component.html',
  styleUrls: ['./esim-ca-request.component.scss'],
})
export class EsimCaRequestComponent {
  rowData: any;
  dealer;
  gridApi: AgGridAngular;
  selectedRows: any[] = [];
  selectedRowSize: any;
  minDate: string;
  maxDate: string;
  today = new Date();
  defaultColDef = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  zohoInvoice: any;
  columnDefinvoice: any;
  columnDefs: any = [
    {
      headerName: 'CA Requested ID',
      field: 'carequestid',
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
    {
      headerName: 'Card Activation Date',
      field: 'cardactivationdate',
      width: 180,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Card End Date',
      field: 'cardenddate',
      width: 180,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Card Status',
      field: 'cardstatus',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Comment',
      field: 'comment',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Status Updated Date',
      field: 'statusupdateddate',
      width: 180,
      filter: 'agTextColumnFilter',
    },
  ];

  plan: string;
  topupModalToggle: boolean = false;
  plans = [
    {
      planValue: '1 Year',
      years: '1 Year',
    },
    {
      planValue: '2 Year',
      years: '2 Year',
    },
  ];
  Topupplans = [
    {
      planValue: '1 Month',
      years: '1 Month',
    },
    {
      planValue: '2 Month',
      years: '2 Month',
    },
    {
      planValue: '3 Month',
      years: '3 Month',
    },
    {
      planValue: '4 Month',
      years: '4 Month',
    },
    {
      planValue: '5 Month',
      years: '5 Month',
    },
    {
      planValue: '6 Month',
      years: '6 Month',
    },
    {
      planValue: '7 Month',
      years: '7 Month',
    },
    {
      planValue: '8 Month',
      years: '8 Month',
    },
    {
      planValue: '9 Month',
      years: '9 Month',
    },
    {
      planValue: '10 Month',
      years: '10 Month',
    },
    {
      planValue: '11 Month',
      years: '11 Month',
    },
  ];
  tabs: any = [{ label: 'Pending' }, { label: 'Activated' }];
  activeTab: any = {};
  RenewalModalToggle: boolean = false;
  renewalModalToggle: boolean = false;
  extendValidityModalToggle: any = false;
  activationModalToggle: any = false;
  isActivatedTab: boolean = false;
  bsnlCertificateModalToggle: boolean = false;

  generateInvoiceModalToggle: boolean = false;
  @ViewChild('CAGrid', { static: false }) myGrid: any;
  @ViewChild('selectedRowsGrid', { static: false })
  selectedRowsGrid: AgGridAngular;

  activationForm: FormGroup;
  @ViewChild('activateProduct', { static: false }) activateButton: ElementRef;
  @ViewChild('renewProduct', { static: false }) renewalButton: ElementRef;
  @ViewChild('CAGrid', { static: false }) componentGrid: AgGridAngular;

  @ViewChild('tabMenu', { static: false }) tabMenu: any;
  gridData: any;
  selectedRowColumnDefs: any[] = [
    {
      headerName: 'CA Requested ID',
      field: 'carequestid',
      width: 230,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID No',
      field: 'primaryiccidno',
      width: 300,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 230,
      filter: 'agTextColumnFilter',
    },
  ];

  invoicegrid: any;
  pagePermissions: any;
  date: any;
  invoicedata: any;
  whichinvoice: any;
  topupvalidity: string;
  editfilter: any;
  visible: boolean = false;
  selectedimei: any[];
  selctedproductname: any;
  endisConfirm: boolean = false;
  editData;
  columnsApi: any;
  usertype: any;
  resultofsaveapi: any;
  renewalvalidity: string;
  currenttab: 'Pending';
  renewalModalLoader: boolean;
  topupModalLoader: boolean;
  extendValidityModalLoader: boolean;
  activationModalLoader: boolean;
  generateInvoiceModalLoader: boolean;
  firstAttemptRenewal: boolean;
  firstAttemptTopup: boolean;
  firstAttemptExtend: boolean;
  firstAttemptActivation: boolean;

  constructor(
    private loader: LoaderService,
    private ajaxService: AjaxService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private permission: PermissionService,
    private excel: ExportExcelService,
    private gridService: AgGridService,
    public gridPagination: GridPaginationService
  ) { }

  updateGridData() {
    if (this.selectedRowsGrid && this.invoicedata) {
      this.selectedRowsGrid.api.setRowData(this.invoicedata);
      this.selectedRowsGrid.api.refreshCells();
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
      editedRow.validity = selectedProductDetails.validityperiod;
    }
    let replacingData = this.invoicedata.map((row) => {
      if (row.primaryiccid == this.selectedimei) {
        row = editedRow;
      }
      return row;
    });
    this.invoicedata = replacingData;
    // Close the modal or perform any other necessary actions
    this.visible = false;
  }

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

  createActivationForm() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.date = today;
    this.activationForm = this.formbuilder.group({
      renewalActivationDate: [today],
      comment: [''],
    });
  }

  handleRenewalModalChange(event: boolean) {
    this.renewalModalToggle = event;
    if (!event && (this.firstAttemptRenewal == true)) {
      this.gridApi?.api.deselectAll();
    }
    this.firstAttemptRenewal = true;
  }
  handleTopupModalChange(event) {
    this.topupModalToggle = event;
    if (!event && (this.firstAttemptTopup == true)) {
      this.gridApi?.api.deselectAll();
    }
    this.firstAttemptTopup = true;
  }
  handleExtendValidityModalChange(event) {
    this.extendValidityModalToggle = event;
    if (!event && (this.firstAttemptExtend == true)) {
      this.gridApi?.api.deselectAll();
    }
    this.firstAttemptExtend = true;
  }
  handleBsnlCertificateModalChange(event) {
    this.bsnlCertificateModalToggle = event;
  }
  handleActivationModalChange(event) {
    this.activationModalToggle = event;
    if (!event && (this.firstAttemptActivation == true)) {
      this.gridApi?.api.deselectAll();
    }
    this.firstAttemptActivation = true;
  }
  generateInvoiceModalToggleChange(event) {
    this.generateInvoiceModalToggle = event;
  }

  toggleRenewalModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length > 1) {
      const firstPONumber = this.selectedRows[0].requestedcompany;
      for (let i = 1; i < this.selectedRows.length; i++) {
        if (firstPONumber !== this.selectedRows[i].requestedcompany) {
          this.messageService.add({
            key: 'toast1',
            severity: 'warn',
            summary: 'Warning',
            detail:
              'The selected companies are different, Please select rows with the same company.',
          });
          this.renewalModalToggle = false;
          return;
        }
      }
    }

    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase Order to request for Renewal!!',
      });
      this.renewalModalToggle = false;
      return;
    }
    if (!this.renewalModalToggle) {
      this.renewalModalLoader = !this.renewalModalToggle;
      setTimeout(() => this.renewalModalToggle = !this.renewalModalToggle, 200);
    } else {
      this.renewalModalToggle = !this.renewalModalToggle;
    }
    this.plan = '';
  }

  toggleTopupModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length > 1) {
      const firstPONumber = this.selectedRows[0].requestedcompany;
      for (let i = 1; i < this.selectedRows.length; i++) {
        if (firstPONumber !== this.selectedRows[i].requestedcompany) {
          this.messageService.add({
            key: 'toast1',
            severity: 'warn',
            summary: 'Warning',
            detail:
              'The selected companies are different, Please select rows with the same company.',
          });
          this.topupModalToggle = false;
          return;
        }
      }
    }

    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase Order to request for Topup!!',
      });
      this.topupModalToggle = false;
      return;
    }
    if (!this.topupModalToggle) {
      this.topupModalLoader = !this.topupModalToggle;
      setTimeout(() => this.topupModalToggle = !this.topupModalToggle, 200);
    } else {
      this.topupModalToggle = !this.topupModalToggle;
    }
    this.plan = '';
  }

  toggleBsnlCertificateModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase order to request for BSNL Certificate!!',
      });
      this.bsnlCertificateModalToggle = false;
      return;
    }
    this.bsnlCertificateModalToggle = !this.bsnlCertificateModalToggle;
    this.plan = '';
  }

  toggleExtendValidityModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length > 1) {
      const firstPONumber = this.selectedRows[0].requestedcompany;
      for (let i = 1; i < this.selectedRows.length; i++) {
        if (firstPONumber !== this.selectedRows[i].requestedcompany) {
          this.messageService.add({
            key: 'toast1',
            severity: 'warn',
            summary: 'Warning',
            detail:
              'The selected companies are different, Please select rows with the same company.',
          });
          this.extendValidityModalToggle = false;
          return;
        }
      }
    }

    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase order to request for Extend 1 Year!!',
      });
      this.extendValidityModalToggle = false;
      return;
    }
    if (!this.extendValidityModalToggle) {
      this.extendValidityModalLoader = !this.extendValidityModalToggle;
      setTimeout(() => this.extendValidityModalToggle = !this.extendValidityModalToggle, 200);
    } else {
      this.extendValidityModalToggle = !this.extendValidityModalToggle;
    }
    this.plan = '';
  }

  PendingInvoice() {
    if (this.whichinvoice == 'extend') {
      let data = [];
      this.selectedRows.map((row) => {
        data.push({
          primaryiccidno: row.primaryiccidno,
          cardstatus: 'Extra 1 Year',
        });
      });

      this.loader.presentLoader();
      let url =
        ServerUrl.live +
        '/esim/getpendinginvoice?customerid=' +
        localStorage.getItem('userName') +
        '&validityperiod=1 Year';
      this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
        this.invoicedata = res;
        this.dealer = this.selectedRows[0].requestedcompany;
        this.toggleGenearteInvoiceModal();
        this.loader.dismissLoader();
      });
    } else if (this.whichinvoice == 'TopUp') {
      let data = [];
      this.selectedRows.map((row) => {
        data.push({
          primaryiccidno: row.primaryiccidno,
          cardstatus: 'TopUp',
        });
      });

      this.loader.presentLoader();
      let url =
        ServerUrl.live +
        '/esim/getpendinginvoice?customerid=' +
        localStorage.getItem('userName') +
        '&validityperiod=' +
        this.topupvalidity;

      this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
        this.invoicedata = res;
        this.dealer = this.selectedRows[0].requestedcompany;
        this.toggleGenearteInvoiceModal();
        this.loader.dismissLoader();
      });
    } else if (this.whichinvoice == 'Renewal') {
      let data = [];
      this.selectedRows.map((row) => {
        data.push({
          primaryiccidno: row.primaryiccidno,
          cardstatus: 'Renewal',
        });
      });

      this.loader.presentLoader();
      let url =
        ServerUrl.live +
        '/esim/getpendinginvoice?customerid=' +
        localStorage.getItem('userName') +
        '&validityperiod=' +
        this.renewalvalidity;
      this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
        this.invoicedata = res;
        this.dealer = this.selectedRows[0].requestedcompany;
        this.toggleGenearteInvoiceModal();
        this.loader.dismissLoader();
      });
    } else if (this.whichinvoice == 'Bsnl') {
      let data = [];
      this.selectedRows.map((row) => {
        data.push({
          primaryiccidno: row.primaryiccidno,
          cardstatus: 'BSNL Certificate',
        });
      });

      this.loader.presentLoader();
      let url =
        ServerUrl.live +
        '/esim/getpendinginvoice?customerid=' +
        localStorage.getItem('userName') +
        '&validityperiod=' +
        this.selectedRows[0].validityperiod;
      this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
        this.invoicedata = res;
        this.toggleGenearteInvoiceModal();
        this.loader.dismissLoader();
      });
    }
  }

  //  On Going Process of Extend Invoice

  toggleGenearteInvoiceModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (!this.generateInvoiceModalToggle) {
      this.generateInvoiceModalLoader = !this.generateInvoiceModalToggle;
      setTimeout(() => this.generateInvoiceModalToggle = !this.generateInvoiceModalToggle, 200);
    } else {
      this.generateInvoiceModalToggle = !this.generateInvoiceModalToggle;
    }
    this.plan = '';
    this.activationForm.reset();
    this.visible = false;
    this.getGridData();
    if (this.whichinvoice == 'Renewal') {
      this.invoicegrid = [
        {
          headerName: 'Primary ICCID',
          field: 'primaryiccid',
          width: 190,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Card Status',
          field: 'cardstatus',
          width: 140,
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
        {
          headerName: 'Activation Payment',
          field: 'productprice',
          width: 200,
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
        // {
        //   width: 120,
        //   cellRenderer: ColourCellRenderer,
        //   cellRendererParams: {
        //     text: 'Delete',
        //   },
        //   onCellClicked: this.handleConfirm.bind(this),
        //   sortable: false,
        // },
      ];
      this.invoicegrid.push({
        width: 100,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Edit',
        },
        onCellClicked: this.edit.bind(this),
        sortable: false,
      });

      this.invoicegrid.push({
        width: 120,
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
      });
    } else {
      this.invoicegrid = [
        {
          headerName: 'Primary ICCID',
          field: 'primaryiccid',
          width: 190,
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
        {
          headerName: 'Activation Payment',
          field: 'productprice',
          width: 200,
          filter: 'agTextColumnFilter',
        },
      ];
      this.invoicegrid.push({
        width: 100,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Edit',
        },
        onCellClicked: this.edit.bind(this),
        sortable: false,
      });

      this.invoicegrid.push({
        width: 120,
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
      });
    }
  }

  GenerateInvoice(whichinvoice) {
    if (whichinvoice == 'extend') {
      let data = [];
      this.invoicedata.map((row) => {
        data.push({
          primaryiccidno: row.primaryiccid,
          cardstatus: 'Extra 1 Year',
          productid: row.zohoproductid,
          productname: row.productname,
          purchaserate: parseInt(row.purchaserate),
          rate: parseInt(row.productprice),
          description: row.description,
          validityperiod: row.validity,
          pagename: 'Extend',
        });
      });

      this.loader.presentLoader();
      let url =
        ServerUrl.live +
        '/esim/saveZohoExtendOneYearInvoiceHeader?headerid=&stockowner=' +
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
    } else if (whichinvoice == 'TopUp') {
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
    } else if (whichinvoice == 'Renewal') {
      let data = [];
      this.invoicedata.map((row) => {
        data.push({
          primaryiccidno: row.primaryiccid,
          renewalno: '1',
          cardstatus: row.cardstatus,
          productid: row.zohoproductid,
          productname: row.productname,
          purchaserate: parseInt(row.purchaserate),
          rate: parseInt(row.productprice),
          description: row.description,
          validityperiod: row.validity,

          pagename: 'Renewal',
        });
      });

      this.loader.presentLoader();
      let url =
        ServerUrl.live +
        '/esim/saveZohoRenewalInvoiceHeader?headerid=&stockowner=' +
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
      // } else if (whichinvoice == 'Bsnl') {
      //   let data = [];
      //   this.invoicedata.map((row) => {
      //     data.push({
      //       stockowner: row.customerid,
      //       primaryiccidno: row.primaryiccid,
      //       cardstatus: 'BSNL Certificate',
      //       productid: row.zohoproductid,
      //       productname: row.productname,
      //       purchaserate: parseInt(row.purchaserate),
      //       rate: parseInt(row.productprice),
      //       description: row.description,
      //       validityperiod: row.validity,
      //       noofunits: this.invoicedata.length,
      //       pagename: 'BSNL Certificate',
      //     });
      //   });

      //   this.loader.presentLoader();
      //   let url =
      //     ServerUrl.live +
      //     '/esim/saveInvoiceApproved?username=' +
      //     localStorage.getItem('userName');
      //   this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      //     this.loader.dismissLoader();
      //     if (res.message == 'Approved Invoice Details Saved Successfully') {
      //       this.messageService.add({
      //         key: 'toast1',
      //         severity: 'success',
      //         summary: 'Success',
      //         detail: res.message,
      //       });
      //       this.getGridData();
      //       this.toggleGenearteInvoiceModal();
      //     } else {
      //       this.messageService.add({
      //         key: 'toast1',
      //         severity: 'warn',
      //         summary: 'Warning',
      //         detail: res.message,
      //       });
      //     }
      //   });
      // }
    }
  }

  toggleActivationModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase Order for Activation!!',
      });
      this.activationModalToggle = false;
      return;
    }
    if (!this.activationModalToggle) {
      this.activationModalLoader = !this.activationModalToggle;
      setTimeout(() => this.activationModalToggle = true, 200);
    } else {
      this.activationModalToggle = !this.activationModalToggle;
    }
    this.plan = '';
    this.activationForm.reset();
  }

  onGridReady(params) {
    this.gridApi = params;
    this.getGridData();
  }

  tabChanged(event) {
    this.loader.presentLoader();
    this.currenttab = event.label;
    let url =
      ServerUrl.live +
      '/esim/getAllCARequest?companyId=' +
      localStorage.getItem('userName') + "&page=" + this.gridPagination.currentPage + "&data=" + (this.currenttab == 'Pending' ? 'inactive' : 'active');
    if (this.gridPagination.isSearched) {
      url = url + "&Search=" + this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.gridData = res;
      this.rowData = this.gridData;
      let countUrl = "/esim/getAllCountCARequest?companyId=" + localStorage.getItem('userName') + "&data=" + (this.currenttab == 'Pending' ? 'inactive' : 'active');
      if (this.gridPagination.isSearched) {
        countUrl = countUrl + "&Search=" + this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      if (this.currenttab == 'Pending') {
        if (this.usertype == 'SuperAdmin') {
          this.columnDefs = [
            {
              headerName: 'CA Requested ID',
              field: 'carequestid',
              width: 190,
              filter: 'agTextColumnFilter',
              checkboxSelection: true,
            },
            {
              headerName: 'Invoice No',
              field: 'invoiceno',
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
            {
              headerName: 'Card Activation Date',
              field: 'cardactivationdate',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Card End Date',
              field: 'cardenddate',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Card Status',
              field: 'cardstatus',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Comment',
              field: 'comment',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Status Updated Date',
              field: 'statusupdateddate',
              width: 180,
              filter: 'agTextColumnFilter',
            },
          ];
        } else {
          this.columnDefs = [
            {
              headerName: 'CA Requested ID',
              field: 'carequestid',
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
            {
              headerName: 'Card Activation Date',
              field: 'cardactivationdate',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Card End Date',
              field: 'cardenddate',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Card Status',
              field: 'cardstatus',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Comment',
              field: 'comment',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Status Updated Date',
              field: 'statusupdateddate',
              width: 180,
              filter: 'agTextColumnFilter',
            },
          ];
        }
      } else {
        this.columnDefs = [
          {
            headerName: 'CA Requested ID',
            field: 'carequestid',
            width: 190,
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
          },
          {
            headerName: 'Invoice No',
            field: 'invoiceno',
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
          {
            headerName: 'Card Activation Date',
            field: 'cardactivationdate',
            width: 180,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Card End Date',
            field: 'cardenddate',
            width: 180,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Card Status',
            field: 'cardstatus',
            width: 150,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Comment',
            field: 'comment',
            width: 150,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Status Updated Date',
            field: 'statusupdateddate',
            width: 180,
            filter: 'agTextColumnFilter',
          },
        ];
      }

      this.isActivatedTab = event.label === 'Activated';
      if (event.label == 'Activated') {
        this.renewalButton
          ? (this.renewalButton.nativeElement.disabled = false)
          : null;
        this.activateButton
          ? (this.activateButton.nativeElement.disabled = true)
          : null;
        // this.filterGrid('');
      } else if (event.label == 'Pending') {
        this.renewalButton
          ? (this.renewalButton.nativeElement.disabled = true)
          : null;
        this.activateButton
          ? (this.activateButton.nativeElement.disabled = false)
          : null;
        // this.filterGrid(null);
      }
      this.loader.dismissLoader();
    });
  }

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData();
  }
  // filterGrid(checkFor) {
  //   if (checkFor != null) {
  //     this.rowData = this.gridData.filter((data) => {
  //       return data.statusupdateddate != null;
  //     });
  //     setTimeout(() => {
  //       this.gridService.autoSizeColumns(this.gridApi);
  //     }, 0);
  //   } else {
  //     this.rowData = this.gridData.filter((data) => {
  //       return data.statusupdateddate == null;
  //     });
  //     setTimeout(() => {
  //       this.gridService.autoSizeColumns(this.gridApi);
  //     }, 0);
  //   }
  // }

  getGridData() {
    this.tabChanged(this.tabMenu.activeItem);
  }

  requestForRenewal(d) {
    if (this.zohoInvoice != 0) {
      this.whichinvoice = d;
      var now = new Date();
      var day = ('0' + now.getDate()).slice(-2);
      var month = ('0' + (now.getMonth() + 1)).slice(-2);
      var today = day + '-' + month + '-' + now.getFullYear();
      let requestBody = [];
      this.selectedRows.map((row) => {
        requestBody.push({
          id: '',
          primaryiccidno: row.primaryiccidno,
          fallbackiccidno: row.fallbackiccidno,
          requestedcompany: JSON.parse(localStorage.getItem('loginData'))
            .companyname,
          validityperiod: this.plan,
          createdby: localStorage.getItem('userName'),
          createddate: today,
        });
      });
      this.renewalvalidity = this.plan;
      let url = ServerUrl.live + '/esim/saveRenewalRequest';
      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'Renewal Request saved successfully') {
          this.toggleRenewalModal();
          this.resultofsaveapi = res.requestid;
          this.PendingInvoice();
          // if (this.usertype == 'SuperAdmin') {
          //   this.PendingInvoice();
          // }
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
  }

  requestForTopup(d) {
    if (this.zohoInvoice != 0) {
      this.whichinvoice = d;
      let requestBody = [];
      this.selectedRows.map((row) => {
        requestBody.push({
          id: '',
          primaryiccidno: row.primaryiccidno,
          fallbackiccidno: row.fallbackiccidno,
          requestedcompany: JSON.parse(localStorage.getItem('loginData'))
            .companyname,
          validityperiod: this.plan,
          createdby: localStorage.getItem('userName'),
        });
      });
      this.topupvalidity = this.plan;
      let url = ServerUrl.live + '/esim/saveTopupRequest';
      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'Topup Request saved successfully') {
          this.toggleTopupModal();
          this.resultofsaveapi = res.requestid;
          this.PendingInvoice();
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
  }

  requestForExtendValidity(d) {
    if (this.zohoInvoice != 0) {
      this.whichinvoice = d;
      let requestBody = [];
      this.selectedRows.map((row) => {
        requestBody.push({
          id: '',
          primaryiccidno: row.primaryiccidno,
          fallbackiccidno: row.fallbackiccidno,
          requestedcompany: JSON.parse(localStorage.getItem('loginData'))
            .companyname,
          validityperiod: this.plan,
          createdby: localStorage.getItem('userName'),
        });
      });
      let url = ServerUrl.live + '/esim/saveExtendOneYearRequest';
      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'Extend 1 Year request saved successfully') {
          this.toggleExtendValidityModal();
          this.resultofsaveapi = res.requestid;
          this.PendingInvoice();
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
  }

  requestForBsnlCertficate(d) {
    if (this.zohoInvoice != 0) {
      this.whichinvoice = d;
      let requestBody = [];
      this.selectedRows.map((row) => {
        requestBody.push({
          id: '',
          primaryiccidno: row.primaryiccidno,
          fallbackiccidno: row.fallbackiccidno,
          requestedcompany: JSON.parse(localStorage.getItem('loginData'))
            .companyname,
          validityperiod: this.plan,
          createdby: localStorage.getItem('userName'),
        });
      });
      let url = ServerUrl.live + '/esim/saveBSNLCertificateRequest';
      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'BSNL Certificate Request saved successfully') {
          this.toggleBsnlCertificateModal();
          this.resultofsaveapi = res.requestid;
          this.PendingInvoice();
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
  }

  CommercialActivation() {
    let requestBody = [];
    let splitedDate = this.date.split('-');
    let date = splitedDate[2] + '-' + splitedDate[1] + '-' + splitedDate[0];
    this.selectedRows.map((row) => {
      requestBody.push({
        primaryiccidno: row.primaryiccidno,
        cardactivationdate: date,
        invoiceno: row.invoiceno,
        comment: this.activationForm.controls['comment'].value
          ? this.activationForm.controls['comment'].value
          : '',
        createdby: localStorage.getItem('userName'),
      });
    });
    let url = ServerUrl.live + '/esim/saveCAStatusUpdate';
    this.loader.presentLoader();
    this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
      if (
        res.message ==
        'The CA request has been processed successfully, and the activation has been completed.'
      ) {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.getGridData();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: res.message,
        });
      }
      this.loader.dismissLoader();
      this.toggleActivationModal();
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
      title: 'Esim Extend 1 Year Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.zohoInvoice = localStorage.getItem('zohocount');

    this.maxDate = this.today.getFullYear() + '-';
    this.maxDate +=
      (this.today.getMonth() + 1 < 10
        ? '0' + (this.today.getMonth() + 1).toString()
        : (this.today.getMonth() + 1).toString()) + '-';
    this.maxDate +=
      this.today.getDate() < 10
        ? '0' + this.today.getDate().toString()
        : this.today.getDate().toString();

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.minDate = sevenDaysAgo.getFullYear() + '-';
    this.minDate +=
      (sevenDaysAgo.getMonth() + 1 < 10
        ? '0' + (sevenDaysAgo.getMonth() + 1).toString()
        : (sevenDaysAgo.getMonth() + 1).toString()) + '-';
    this.minDate +=
      sevenDaysAgo.getDate() < 10
        ? '0' + sevenDaysAgo.getDate().toString()
        : sevenDaysAgo.getDate().toString();

    this.pagePermissions = this.permission.getPermissionDetails('CA Request');
    this.createActivationForm();
    this.activeTab = this.tabs[0];
    this.invoicegrid = [
      {
        headerName: 'Primary ICCID',
        field: 'primaryiccid',
        width: 190,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Validity Period',
        field: 'validity',
        width: 140,
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
        headerName: 'Activation Payment',
        field: 'productprice',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        width: 100,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Edit',
        },
        onCellClicked: this.edit.bind(this),
        sortable: false,
      },
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
    this.tabChanged(this.activeTab);
  }
}
