import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { LoaderService } from 'src/app/service/loader.service';
import { ServerUrl } from 'src/environment';
import { EsimCaRequestComponent } from '../esim-requests/esim-ca-request/esim-ca-request.component';
import { EsimRenewalRequestComponent } from '../esim-requests/esim-renewal-request/esim-renewal-request.component';
import { EsimTopupRequestComponent } from '../esim-requests/esim-topup-request/esim-topup-request.component';
import { EsimExtendValidityRequestComponent } from '../esim-requests/esim-extend-validity-request/esim-extend-validity-request.component';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { PermissionService } from 'src/app/service/permission.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-esim-dashboard',
  templateUrl: './esim-dashboard.component.html',
  styleUrls: ['./esim-dashboard.component.scss'],
})
export class EsimDashboardComponent implements OnInit {
  dashboardData: any;
  data: any = [];
  options: any = [];
  caChart: any;
  scaleOfGraphs: {};
  companies: any;
  orderFor: any;
  purchaseModal: boolean = false;
  stockModal: boolean = false;
  shippingModal: boolean = false;
  poModal: boolean = false;
  caModal: boolean = false;
  rrModal: boolean = false;
  topupModal: boolean = false;
  extend1YrModal: boolean = false;
  rowData: any;
  columnDefs: any;
  selectedRowSize: any;
  defaultColDef = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };
  caColumnDefs = this.caColumn.columnDefs;
  rrColumnDefs = this.rrColumn.columnDefs;
  topupColumnDefs = this.topupColumn.columnDefs;
  extendColumnDefs = this.extendColumn.columnDefs;
  activeTab: any;
  tabs: any = [{ label: 'Pending' }, { label: 'Activated' }];
  purchasetab: any = [{ label: 'Un-Assigned' }, { label: 'Assigned' }];
  stocktab: any = [{ label: 'In-Active' }, { label: 'Active' }];
  shippingtab: any = [{ label: 'Un-Shipped' }, { label: 'Shipped' }];
  potab: any = [{ label: 'Accepted' }, { label: 'Rejected' }];

  gridData: any;
  @ViewChild('tabMenu', { static: false }) tabMenu: any;
  plugins: any;
  pagePermissions: any;
  renewalno: any[] = [{ renewalId: 1, renewalNo: 'Renewal 1' }];
  noofrenewals;
  purchaseModalLoader: boolean;
  stockModalLoader: boolean;
  shippingModalLoader: boolean;
  poModalLoader: boolean;
  caModalLoader: boolean;
  rrModalLoader: boolean;
  topupModalLoader: boolean;
  extend1YrModalLoader: boolean;
  purchasecolumnDefs: any = [
    {
      headerName: 'Primary ICCID',
      field: 'primaryiccid',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Primary TSP',
      field: 'primarytsp',
      filter: 'agTextColumnFilter',
      width: 130,
    },

    {
      headerName: 'Primary MSISDN',
      field: 'primarymsisdn',
      width: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary Status',
      field: 'primarystatus',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback ICCID',
      field: 'fallbackiccid',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback TSP',
      field: 'fallbacktsp',
      width: 130,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback MSISDN',
      field: 'fallbackmsisdn',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback Status',
      field: 'fallbackstatus',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Card State',
      field: 'cardstate',
      width: 120,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Card Status',
      field: 'cardstatus',
      width: 125,
      filter: 'agTextColumnFilter',
    },

    {
      headerName: 'Activate On',
      field: 'activateon',
      width: 130,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Expired On',
      field: 'expiredon',
      width: 130,
      filter: 'agTextColumnFilter',
    },
  ];
  stockcolumnDefs: any = [];
  shippingColumnDefs: any = [
    {
      headerName: 'Company Name',
      field: 'companyname',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Customer Id',
      field: 'customerid',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'PO Date',
      field: 'podate',
      filter: 'agTextColumnFilter',
      width: 150,
    },
    {
      headerName: 'Purchase Order Number',
      field: 'pono',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Invoice No',
      field: 'invoiceid',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Amount',
      field: 'grandtotal',
      filter: 'agTextColumnFilter',
      width: 170,
    },
    {
      headerName: 'Total Quantity',
      field: 'totalquantity',
      filter: 'agTextColumnFilter',
      width: 170,
    },
    {
      headerName: 'Tracking No',
      field: 'trackingno',
      filter: 'agTextColumnFilter',
      width: 170,
    },
  ];

  poColumnDefs: any = [
    {
      headerName: 'Company Name',
      field: 'companyname',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Customer Id',
      field: 'customerid',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'PO Date',
      field: 'podate',
      filter: 'agTextColumnFilter',
      width: 150,
    },
    {
      headerName: 'Purchase Order Number',
      field: 'pono',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Invoice No',
      field: 'invoiceid',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Amount',
      field: 'grandtotal',
      filter: 'agTextColumnFilter',
      width: 170,
    },
    {
      headerName: 'Total Quantity',
      field: 'totalquantity',
      filter: 'agTextColumnFilter',
      width: 170,
    },
    {
      headerName: 'Tracking No',
      field: 'trackingno',
      filter: 'agTextColumnFilter',
      width: 170,
    },
  ];

  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    // private purchseColumn: SimDetailsUploadComponent,
    private caColumn: EsimCaRequestComponent,
    private rrColumn: EsimRenewalRequestComponent,
    private topupColumn: EsimTopupRequestComponent,
    private extendColumn: EsimExtendValidityRequestComponent,
    private router: Router,
    private permission: PermissionService
  ) { }

  ngOnInit() {
    Chart.register(ChartDataLabels);
    this.pagePermissions =
      this.permission.getPermissionDetails('Esim Dashboard');
    this.getDashboardData();
    if (this.pagePermissions.selectcompany.value) {
      this.getCompanies();
    }
    this.removeCheckboxGrid();
    this.getMaxRenewals();
    this.activeTab = this.tabs[0];
    this.activeTab = this.purchasetab[0];
  }

  getDashboardData() {
    let url =
      ServerUrl.live +
      '/esim/getDashboardDetails?companyId=' +
      localStorage['userName'];
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.dashboardData = res;
      this.setScaleForGraphs(res);
      this.initializeCharts();
    });
  }

  getCompanies() {
    let url = ServerUrl.live + '/esim/getAllCompanies';
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.companies = res;
    });
  }

  getDashboardDataFor(event) {
    let url =
      ServerUrl.live +
      '/esim/getDashboardDetails?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']);
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.dashboardData = res;
      this.setScaleForGraphs(res);
      this.initializeCharts();
    });
  }

  setScaleForGraphs(data) {
    let scaleOfGraphs = {};
    console.log(data);
    let max;
    Object.keys(data).map((da) => {
      switch (da) {
        case 'purchase_details':
          max = Math.max(data[da].sold, data[da].unsold);
          break;
        case 'po_status':
          max = Math.max(data[da].accepted, data[da].rejected);
          break;
        case 'shipping_details':
          max = Math.max(data[da].shipped, data[da].not_shipped);
          break;
        case 'stock_status':
          max = Math.max(data[da].active, data[da].inactive);
          break;
        default:
          max = Math.max(data[da].pending, data[da].active);
      }
      let numDigits = Math.floor(Math.log10(Math.abs(max)) + 1);
      if (numDigits <= 1) numDigits = 2;
      const multiplier = 10 ** (numDigits - 1);
      let roundedScale = Math.ceil(max / multiplier) * multiplier;
      let calculated = roundedScale - (multiplier / 10)
      console.log(numDigits, multiplier, max, roundedScale, calculated);
      if (max >= calculated) {
        scaleOfGraphs[da] =
          Number.isNaN(roundedScale) || roundedScale == 0
            ? 10
            : roundedScale + multiplier;
      } else {
        scaleOfGraphs[da] =
          Number.isNaN(roundedScale) || roundedScale == 0 ? 10 : roundedScale;
      }
    });
    this.scaleOfGraphs = scaleOfGraphs;
    console.log(this.scaleOfGraphs);
  }

  handlePurchaseModal(event) {
    this.purchaseModal = event;
  }
  handleStocksModal(event) {
    this.stockModal = event;
  }
  handleShippingModal(event) {
    this.shippingModal = event;
  }
  handlePOStatusModal(event) {
    this.poModal = event;
  }
  handleCAModal(event) {
    this.caModal = event;
  }
  handleRRModal(event) {
    this.rrModal = event;
    this.renewalno;
  }
  handleTopupModal(event) {
    this.topupModal = event;
  }
  handleextend1YrModal(event) {
    this.extend1YrModal = event;
  }

  togglePurchaseModal() {
    this.rowData = [];
    this.activeTab = (this.purchasetab as MenuItem[])[0];
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/getSimDetails?data=un-assigned';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.loader.dismissLoader();
    });
    if (!this.purchaseModal) {
      this.purchaseModalLoader = !this.purchaseModal;
      setTimeout(() => (this.purchaseModal = !this.purchaseModal), 200);
    } else {
      this.purchaseModal = !this.purchaseModal;
    }
  }

  toggleStockModal() {
    this.rowData = [];
    this.activeTab = (this.stocktab as MenuItem[])[0];
    var url =
      ServerUrl.live +
      '/esim/getActiveInactiveStocks?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']) +
      '&status=In-Active';
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.tabChanged(this.tabMenu.activeItem);
      this.loader.dismissLoader();
    });
    if (!this.stockModal) {
      this.stockModalLoader = !this.stockModal;
      setTimeout(() => (this.stockModal = !this.stockModal), 200);
    } else {
      this.stockModal = !this.stockModal;
    }
  }

  toggleShippingModal() {
    this.rowData = [];
    this.activeTab = (this.shippingtab as MenuItem[])[0];
    let url =
      ServerUrl.live +
      '/esim/getAllPurchaseOrderShippingStatus?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']) +
      '&status=Not Shipped';
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.loader.dismissLoader();
    });
    if (!this.shippingModal) {
      this.shippingModalLoader = !this.shippingModal;
      setTimeout(() => (this.shippingModal = !this.shippingModal), 200);
    } else {
      this.shippingModal = !this.shippingModal;
    }
  }

  togglePOStatusModal() {
    this.rowData = [];
    this.activeTab = (this.potab as MenuItem[])[0];
    var url =
      ServerUrl.live +
      '/esim/getAllPurchaseOrderAccepted?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']);
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.tabChanged(this.tabMenu.activeItem);
      this.loader.dismissLoader();
    });
    if (!this.poModal) {
      this.poModalLoader = !this.poModal;
      setTimeout(() => (this.poModal = !this.poModal), 200);
    } else {
      this.poModal = !this.poModal;
    }
  }

  toggleCAModal() {
    this.rowData = [];
    this.activeTab = (this.tabs as MenuItem[])[0];
    let url =
      ServerUrl.live +
      '/esim/getAllCARequest?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']);
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.tabChanged(this.tabMenu.activeItem);
      this.loader.dismissLoader();
    });
    if (!this.caModal) {
      this.caModalLoader = !this.caModal;
      setTimeout(() => (this.caModal = !this.caModal), 200);
    } else {
      this.caModal = !this.caModal;
    }
  }

  getMaxRenewals() {
    let url =
      ServerUrl.live +
      '/esim/getMaxOfRenewalRequest?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']);
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

  filterGridByRenewal(ev) {
    this.noofrenewals = ev.value;
    let url =
      ServerUrl.live +
      '/esim/getAllRenewalRequest?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']) +
      '&renewalno=' +
      this.noofrenewals;
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.tabChanged(this.tabMenu.activeItem);
      this.loader.dismissLoader();
    });
  }

  toggleRRModal() {
    this.rowData = [];
    this.activeTab = (this.tabs as MenuItem[])[0];
    let url =
      ServerUrl.live +
      '/esim/getAllRenewalRequest?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']) +
      '&renewalno=' +
      this.renewalno[0].renewalId;
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.tabChanged(this.tabMenu.activeItem);
      this.loader.dismissLoader();
    });
    if (!this.rrModal) {
      this.rrModalLoader = !this.rrModal;
      setTimeout(() => (this.rrModal = !this.rrModal), 200);
    } else {
      this.rrModal = !this.rrModal;
    }
  }

  toggleTopupModal() {
    this.rowData = [];
    this.activeTab = (this.tabs as MenuItem[])[0];
    let url =
      ServerUrl.live +
      '/esim/getAllTopupRequest?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']);
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.tabChanged(this.tabMenu.activeItem);
      this.loader.dismissLoader();
    });
    if (!this.topupModal) {
      this.topupModalLoader = !this.topupModal;
      setTimeout(() => (this.topupModal = !this.topupModal), 200);
    } else {
      this.topupModal = !this.topupModal;
    }
  }
  toggleextend1YrModal() {
    this.rowData = [];
    this.activeTab = (this.tabs as MenuItem[])[0];
    let url =
      ServerUrl.live +
      '/esim/getAllExtendOneYearRequest?companyId=' +
      (this.orderFor ? this.orderFor : localStorage['userName']);
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.gridData = res;
      this.tabChanged(this.tabMenu.activeItem);
      this.loader.dismissLoader();
    });
    if (!this.extend1YrModal) {
      this.extend1YrModalLoader = !this.extend1YrModal;
      setTimeout(() => (this.extend1YrModal = !this.extend1YrModal), 200);
    } else {
      this.extend1YrModal = !this.extend1YrModal;
    }
  }

  tabChanged(event) {
    this.activeTab = event;
    if (event.label == 'Activated') {
      this.filterGrid('');
    } else if (event.label == 'Pending') {
      this.filterGrid(null);
    } else if (event.label == 'Un-Assigned') {
      var url = ServerUrl.live + '/esim/getSimDetails?data=' + event.label;
      this.loader.presentLoader();
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        this.gridData = res;
        this.loader.dismissLoader();
      });
    } else if (event.label == 'Assigned') {
      var url = ServerUrl.live + '/esim/getSimDetails?data=' + event.label;
      this.loader.presentLoader();
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        this.gridData = res;
        this.loader.dismissLoader();
      });
    } else if (event.label == 'In-Active') {
      var url =
        ServerUrl.live +
        '/esim/getActiveInactiveStocks?companyId=' +
        (this.orderFor ? this.orderFor : localStorage['userName']) +
        '&status=' +
        event.label;
      this.loader.presentLoader();
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        this.gridData = res;
        this.loader.dismissLoader();
      });
    } else if (event.label == 'Active') {
      var url =
        ServerUrl.live +
        '/esim/getActiveInactiveStocks?companyId=' +
        (this.orderFor ? this.orderFor : localStorage['userName']) +
        '&status=' +
        event.label;
      this.loader.presentLoader();
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        this.gridData = res;
        this.loader.dismissLoader();
      });
    } else if (event.label == 'Un-Shipped') {
      var url =
        ServerUrl.live +
        '/esim/getAllPurchaseOrderShippingStatus?companyId=' +
        (this.orderFor ? this.orderFor : localStorage['userName']) +
        '&status=Not Shipped' +
        this.loader.presentLoader();
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        this.gridData = res;
        this.loader.dismissLoader();
      });
    } else if (event.label == 'Shipped') {
      var url =
        ServerUrl.live +
        '/esim/getAllPurchaseOrderShippingStatus?companyId=' +
        (this.orderFor ? this.orderFor : localStorage['userName']) +
        '&status=' +
        event.label;
      this.loader.presentLoader();
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        this.gridData = res;
        this.loader.dismissLoader();
      });
    } else if (event.label == 'Accepted') {
      var url =
        ServerUrl.live +
        '/esim/getAllPurchaseOrderAccepted?companyId=' +
        (this.orderFor ? this.orderFor : localStorage['userName']);
      this.loader.presentLoader();
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        this.gridData = res;
        this.loader.dismissLoader();
      });
    } else if (event.label == 'Rejected') {
      var url =
        ServerUrl.live +
        '/esim/getAllPurchaseOrderRejected?companyId=' +
        (this.orderFor ? this.orderFor : localStorage['userName']);
      this.loader.presentLoader();
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        this.gridData = res;
        this.loader.dismissLoader();
      });
    }
  }

  filterGrid(checkFor) {
    if (checkFor != null) {
      this.rowData = this.gridData.filter((data) => {
        return data.statusupdateddate != null;
      });
    } else
      this.rowData = this.gridData.filter((data) => {
        return data.statusupdateddate == null;
      });
  }
  redirectTo(url) {
    this.loader.presentLoader();
    this.router.navigateByUrl(url);
    this.loader.dismissLoader();
  }

  initializeCharts() {
    this.data = [
      {
        labels: ['Sold', 'Unsold'],
        datasets: [
          {
            barThickness: 70,
            borderColor: ['#ff1f39', '#1d55ff'],
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: ['#ff1f39a6', '#1d55ffa6'],
            hoverBackgroundColor: ['#ff1f39', '#1d55ff'],
            data: [
              this.dashboardData.purchase_details.sold,
              this.dashboardData.purchase_details.unsold,
            ],
          },
        ],
      },
      {
        labels: ['In-Active', 'Active'],
        datasets: [
          {
            barThickness: 70,
            borderColor: ['#ff1f39', '#1d55ff'],
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: ['#ff1f39a6', '#1d55ffa6'],
            hoverBackgroundColor: ['#ff1f39', '#1d55ff'],
            data: [
              this.dashboardData.stock_status.inactive,
              this.dashboardData.stock_status.active,
            ],
          },
        ],
      },
      {
        labels: ['Shipped', 'Not Shipped'],
        datasets: [
          {
            barThickness: 70,
            borderColor: ['#ff1f39', '#1d55ff'],
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: ['#ff1f39a6', '#1d55ffa6'],
            hoverBackgroundColor: ['#ff1f39', '#1d55ff'],
            data: [
              this.dashboardData.shipping_details.shipped,
              this.dashboardData.shipping_details.not_shipped,
            ],
          },
        ],
      },
      {
        labels: ['Accepted', 'Rejected'],
        datasets: [
          {
            barThickness: 70,
            borderColor: ['#ff1f39', '#1d55ff'],
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: ['#ff1f39a6', '#1d55ffa6'],
            hoverBackgroundColor: ['#ff1f39', '#1d55ff'],
            data: [
              this.dashboardData.po_status.accepted,
              this.dashboardData.po_status.rejected,
            ],
          },
        ],
      },
      {
        labels: ['Pending', 'Active'],
        datasets: [
          {
            barThickness: 70,
            borderColor: ['#ff1f39', '#1d55ff'],
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: ['#ff1f39a6', '#1d55ffa6'],
            hoverBackgroundColor: ['#ff1f39', '#1d55ff'],
            data: [
              this.dashboardData.ca_request.pending,
              this.dashboardData.ca_request.active,
            ],
          },
        ],
      },
      {
        labels: ['Pending', 'Active'],
        datasets: [
          {
            barThickness: 70,
            borderColor: ['#ff1f39', '#1d55ff'],
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: ['#ff1f39a6', '#1d55ffa6'],
            hoverBackgroundColor: ['#ff1f39', '#1d55ff'],
            data: [
              this.dashboardData.renewal_request.pending,
              this.dashboardData.renewal_request.active,
            ],
          },
        ],
      },
      {
        labels: ['Pending', 'Active'],
        datasets: [
          {
            barThickness: 70,
            borderColor: ['#ff1f39', '#1d55ff'],
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: ['#ff1f39a6', '#1d55ffa6'],
            hoverBackgroundColor: ['#ff1f39', '#1d55ff'],
            data: [
              this.dashboardData.topup_request.pending,
              this.dashboardData.topup_request.active,
            ],
          },
        ],
      },
      {
        labels: ['Pending', 'Active'],
        datasets: [
          {
            barThickness: 70,
            borderColor: ['#ff1f39', '#1d55ff'],
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: ['#ff1f39a6', '#1d55ffa6'],
            hoverBackgroundColor: ['#ff1f39', '#1d55ff'],
            data: [
              this.dashboardData.extend_one_year_request.pending,
              this.dashboardData.extend_one_year_request.active,
            ],
          },
        ],
      },
    ];
    this.options = [
      {
        scales: {
          y: {
            min: 0,
            max: this.scaleOfGraphs['purchase_details'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold',
              size: 15,
            },
            anchor: 'end',
            align: 'end',
          },
        },
      },
      {
        scales: {
          y: {
            min: 0,
            max: this.scaleOfGraphs['stock_status'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold',
              size: 15,
            },
            anchor: 'end',
            align: 'end',
          },
        },
      },
      {
        scales: {
          y: {
            min: 0,
            max: this.scaleOfGraphs['shipping_details'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold',
              size: 15,
            },
            anchor: 'end',
            align: 'end',
          },
        },
      },
      {
        scales: {
          y: {
            min: 0,
            max: this.scaleOfGraphs['po_status'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold',
              size: 15,
            },
            anchor: 'end',
            align: 'end',
          },
        },
      },
      {
        scales: {
          y: {
            min: 0,
            max: this.scaleOfGraphs['ca_request'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold',
              size: 15,
            },
            anchor: 'end',
            align: 'end',
          },
        },
      },
      {
        scales: {
          y: {
            min: 0,
            max: this.scaleOfGraphs['renewal_request'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold',
              size: 15,
            },
            anchor: 'end',
            align: 'end',
          },
        },
      },
      {
        scales: {
          y: {
            min: 0,
            max: this.scaleOfGraphs['topup_request'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold',
              size: 15,
            },
            anchor: 'end',
            align: 'end',
          },
        },
      },
      {
        scales: {
          y: {
            min: 0,
            max: this.scaleOfGraphs['extend_one_year_request'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'black',
            font: {
              weight: 'bold',
              size: 15,
            },
            anchor: 'end',
            align: 'end',
          },
        },
      },
    ];
  }

  removeCheckboxGrid() {
    this.caColumnDefs[0].checkboxSelection = false;
    this.rrColumnDefs[0].checkboxSelection = false;
    this.topupColumnDefs[0].checkboxSelection = false;
    this.extendColumnDefs[0].checkboxSelection = false;
    this.rrColumnDefs[0].headerCheckboxSelection = false;
    this.topupColumnDefs[0].headerCheckboxSelection = false;
    this.extendColumnDefs[0].headerCheckboxSelection = false;
  }
}
