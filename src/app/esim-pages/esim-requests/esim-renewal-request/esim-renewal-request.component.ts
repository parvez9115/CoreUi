import { Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
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

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-esim-renewal-request',
  templateUrl: './esim-renewal-request.component.html',
  styleUrls: ['./esim-renewal-request.component.scss'],
})
export class EsimRenewalRequestComponent {
  columnDefs: any = [
    {
      headerName: 'Renewal ID',
      field: 'renewalrequestid',
      width: 200,
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
      headerName: 'Renewal Request Date',
      field: 'renewalrequestdate',
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
  rowData: any[];
  defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  gridApi: AgGridAngular;
  selectedRowSize = 100;
  selectedRows: any[];
  renewalModalToggle: boolean = false;
  renewalForm: FormGroup;
  isActivatedTab: boolean = false;
  @ViewChild('renewProduct', { static: false }) renewalButton: ElementRef;
  @ViewChild('activateProduct', { static: false }) activateButton: ElementRef;
  tabs: any = [{ label: 'Pending' }, { label: 'Activated' }];
  @ViewChild('tabMenu', { static: false }) tabMenu: any;

  activeTab: any = {};

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
  pagePermissions: any;
  extendValidityModalToggle: boolean = false;
  plan: string;
  renewalRequestModalToggle: boolean = false;
  gridData: any;
  renewalno: any[] = [{ renewalId: 1, renewalNo: 'Renewal 1' }];
  renewal: any;
  noofrenewals: Number = 1;
  selectedRenewal: any;
  maxRenewals: any;
  date: string;
  minDate: string;
  maxDate: string;
  today = new Date();
  @ViewChild('ERGrid', { static: false }) myGrid: any;
  zohoInvoice: any;
  invoicedata: any;
  visible: boolean = false;
  generateInvoiceModalToggle: boolean = false;
  dealer: any;
  invoicegrid: any[];
  editfilter: any;
  selectedimei: any[];
  selctedproductname: any;
  endisConfirm: boolean = false;
  editData;

  columnApi: any;
  resultofsaveapi: any;
  currenttab: any;
  usertype: any;
  renewalModalLoader: boolean;
  renewalRequestModalLoader: boolean;
  generateInvoiceModalLoader: boolean;
  firstAttemptRenewal: boolean;
  firstAttemptRequest: boolean;
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
      title: 'Esim Renewal Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  getMaxRenewals() {
    let url =
      ServerUrl.live +
      '/esim/getMaxOfRenewalRequest?companyId=' +
      localStorage.getItem('userName');
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.createRenewalDropdown(res);
    });
  }

  createRenewalDropdown(max) {
    this.renewalno = Array.from({ length: max }, (_, i) => ({
      renewalNo: `Renewal ${i + 1}`,
      renewalId: i + 1,
    }));
  }

  createRenewalForm() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.date = today;
    this.renewalForm = this.formbuilder.group({
      renewalActivationDate: [today],
      comment: [''],
    });
  }

  tabChanged(event) {
    this.currenttab = event.label;
    let url =
      ServerUrl.live +
      '/esim/getAllRenewalRequest?companyId=' +
      localStorage.getItem('userName') +
      '&renewalno=' +
      this.noofrenewals + "&data=" + (this.currenttab == 'Pending' ? 'inactive' : 'active') + "&page=" + this.gridPagination.currentPage;
    if (this.gridPagination.isSearched) {
      url = url + "&Search=" + this.gridPagination.searchTerm;
    }
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.gridData = res;
      this.rowData = this.gridData;
      let countUrl = "/esim/getAllCountRenewalRequest?companyId=" + localStorage.getItem('userName') +
        '&renewalno=' +
        this.noofrenewals + "&data=" + (this.currenttab == 'Pending' ? 'inactive' : 'active');
      if (this.gridPagination.isSearched) {
        countUrl = countUrl + "&Search=" + this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      if (this.currenttab == 'Pending') {
        if (this.usertype == 'SuperAdmin') {
          this.columnDefs = [
            {
              headerName: 'Renewal ID',
              field: 'renewalrequestid',
              width: 200,
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
              headerName: 'Renewal Request Date',
              field: 'renewalrequestdate',
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
              headerName: 'Renewal ID',
              field: 'renewalrequestid',
              width: 200,
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
              headerName: 'Renewal Request Date',
              field: 'renewalrequestdate',
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
            headerName: 'Renewal ID',
            field: 'renewalrequestid',
            width: 200,
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
            headerName: 'Renewal Request Date',
            field: 'renewalrequestdate',
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
  //     // setTimeout(() => {
  //     //   this.gridService.autoSizeColumns(this.gridApi);
  //     // }, 0);
  //   } else {
  //     this.rowData = this.gridData.filter((data) => {
  //       return data.statusupdateddate == null;
  //     });
  //     // setTimeout(() => {
  //     //   this.gridService.autoSizeColumns(this.gridApi);
  //     // }, 0);
  //   }
  // }
  selectedRowColumnDefs: any[] = [
    {
      headerName: 'Renewal Requested ID',
      field: 'renewalrequestid',
      width: 230,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID No',
      field: 'primaryiccidno',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 230,
      filter: 'agTextColumnFilter',
    },
  ];

  toggleRequestRenewalModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase order to request for Renewal!!',
      });
      this.renewalRequestModalToggle = false;
      return;
    }
    if (!this.renewalRequestModalToggle) {
      this.renewalRequestModalLoader = !this.renewalRequestModalToggle;
      setTimeout(
        () =>
          (this.renewalRequestModalToggle = !this.renewalRequestModalToggle),
        200
      );
    } else {
      this.renewalRequestModalToggle = !this.renewalRequestModalToggle;
    }
  }

  handleRequestRenewalModalChange(event: boolean) {
    this.renewalRequestModalToggle = event;
    if (!event && this.firstAttemptRequest == true) {
      this.gridApi?.api.deselectAll();
    }
    this.firstAttemptRequest = true;
  }

  requestForRenewal() {
    if (this.zohoInvoice != 0) {
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
      let url = ServerUrl.live + '/esim/saveRenewalRequest';
      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'Renewal Request saved successfully') {
          this.toggleRequestRenewalModal();
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

  PendingInvoice() {
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
      this.plan;
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      this.invoicedata = res;

      this.toggleGenearteInvoiceModal();
      this.loader.dismissLoader();
      this.dealer = this.selectedRows[0].requestedcompany;
      this.plan = '';
    });
  }

  toggleGenearteInvoiceModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
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
    this.renewalForm.reset();
    this.visible = false;
    this.getGridData();
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
        headerName: 'Rate',
        field: 'productprice',
        width: 100,
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
    // Find the edited row in the grid data based on the IMEI
    const editedRow = this.invoicedata.find(
      (row) => row.primaryiccid == this.selectedimei
    );

    // Update the edited row with the selected product name
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

  GenerateInvoice() {
    let data = [];
    this.invoicedata.map((row) => {
      data.push({
        stockowner: row.customerid,
        primaryiccidno: row.primaryiccid,
        renewalno: (this.selectedRenewal + 1).toString(),
        cardstatus: row.cardstatus,
        productid: row.zohoproductid,
        productname: row.productname,
        purchaserate: parseInt(row.purchaserate),
        rate: parseInt(row.productprice),
        description: row.description,
        validityperiod: row.validity,
        noofunits: this.invoicedata.length,
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
        this.getMaxRenewals();
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

  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }

  filterGridByRenewal(ev) {
    this.noofrenewals = ev.value;
    this.getGridData();
  }

  getGridData() {
    this.tabChanged(this.tabMenu.activeItem);
  }

  toggleRenewalModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase order for Renewal',
      });
      this.renewalModalToggle = false;
      return;
    }
    if (!this.renewalModalToggle) {
      this.renewalModalLoader = !this.renewalModalToggle;
      setTimeout(
        () => (this.renewalModalToggle = !this.renewalModalToggle),
        200
      );
    } else {
      this.renewalModalToggle = !this.renewalModalToggle;
    }
    this.clear();
  }
  clearToast(event) {
    if (this.currenttab == 'Activated') {
      this.selectedRows = this.gridApi.api.getSelectedRows();
      if (this.selectedRows.length > 0) {
        this.messageService.clear();
        if (
          this.selectedRows[0].requestedcompany != event.data.requestedcompany
        ) {
          event.node.setSelected(false);
          this.messageService.add({
            key: 'toast1',
            severity: 'warn',
            summary: 'Warning',
            detail:
              'The selected companies are different, Please select rows with the same company.',
          });
        }
      }
    } else {
      this.selectedRows = this.gridApi.api.getSelectedRows();
      if (this.selectedRows.length > 0) {
        this.messageService.clear();
      }
    }
  }

  clear() {
    this.renewalForm.reset();
  }

  handleRenewalModalChange(event) {
    this.renewalModalToggle = event;
    if (!event && this.firstAttemptRenewal == true) {
      this.gridApi?.api.deselectAll();
    }
    this.firstAttemptRenewal = true;
    this.clear();
  }

  renewalActivation() {
    let requestBody = [];
    var date = this.date.split('-');
    var activateon = date[2] + '-' + date[1] + '-' + date[0];
    this.selectedRows.map((row) => {
      requestBody.push({
        primaryiccidno: row.primaryiccidno,
        cardactivationdate: activateon,
        invoiceno: row.invoiceno,
        comment: this.renewalForm.controls['comment'].value
          ? this.renewalForm.controls['comment'].value
          : '',
        createdby: localStorage.getItem('userName'),
      });
    });
    let url = ServerUrl.live + '/esim/saveRRStatusUpdate';
    this.loader.presentLoader();
    this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
      this.loader.dismissLoader();
      if (
        res.message ==
        'The renewal request has been processed and renewed successfully.'
      ) {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.getGridData();
        this.toggleRenewalModal();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: res.message,
        });
      }
      this.clear();
    });
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.activeTab = this.tabs[0];
    this.zohoInvoice = localStorage.getItem('zohoInvoice');
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

    this.pagePermissions =
      this.permission.getPermissionDetails('Renewal Request');
    this.createRenewalForm();
    this.selectedRenewal = this.renewalno[0].renewalId;
    this.getMaxRenewals();
  }
}
