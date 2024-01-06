import { JsonPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
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
  selector: 'app-esim-customer-price-mapping',
  templateUrl: './esim-customer-price-mapping.component.html',
  styleUrls: ['./esim-customer-price-mapping.component.scss'],
})
export class EsimCustomerPriceMappingComponent {
  selectedMonth: any = '';

  provider: any = [];
  editData;
  companyname: string;
  visible = false;
  dataString: any;

  endisConfirm: boolean = false;
  value: any;
  isEdit: boolean = false;
  endisYear: boolean = false;
  accountsMapping: FormGroup;

  @ViewChild('verticallyCentered', { static: false }) hello;
  selectedRowSize: number;
  columnDefs: any = [];
  pagePermission: any;
  allProvider: any;
  productlist = [];
  allProducts: any;
  customervalue: any;
  productvalue: any;
  simname: any;
  planname: any;
  gridApi: any;
  initialPercentageValue: number = 0;
  balance: any;

  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService,
    private gridService: AgGridService,
    public gridPagination: GridPaginationService
  ) { }

  @ViewChild('myGrid') grid!: AgGridAngular;
  @ViewChild('myGrid', { static: false }) myGrid: any;

  createForm() {
    this.accountsMapping = this.formBuilder.group({
      simprovider: ['', Validators.required],
      planname: ['', Validators.required],
      accountno: ['', Validators.required],
      customerrate: ['', Validators.required],
      rate: ['', Validators.required],
      description: [''],
      initialpercentage: [0, Validators.required],
      balancepercentage: [0, Validators.required],
    });
    this.accountsMapping.get('accountno').disable();
    this.accountsMapping.get('customerrate').disable();
    this.accountsMapping.get('initialpercentage').disable();
    this.accountsMapping.get('balancepercentage').disable();
  }

  getsimprovider() {
    var url = ServerUrl.live + '/esim/getAllCompanies';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.provider = res.map((d) => {
        return { companyname: d.companyname };
      });
      this.allProvider = res;
    });
  }
  getproductname() {
    var url =
      ServerUrl.live +
      '/esim/getAllProductDetail?userId=' +
      localStorage.getItem('userName');
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.productlist = res.map((d) => {
        return { productname: d.productname };
      });
      this.allProducts = res;
    });
  }

  onProductdetails(selectedProductName) {
    const selectedProduct = this.allProducts.find(
      (product) => product.productname === selectedProductName
    );
    this.productvalue = selectedProduct;
    if (this.productvalue.cardstatus == 'New Sim') {
      this.accountsMapping.patchValue({
        accountno: this.productvalue.purchaserate,
        customerrate: this.productvalue.customerprice,
        rate: this.productvalue.productprice,
        description: this.productvalue.description,
        initialpercentage: '',
        balancepercentage: '',
      });
      this.accountsMapping.get('initialpercentage').enable();
      this.accountsMapping.get('balancepercentage').disable();
    } else {
      this.accountsMapping.patchValue({
        accountno: this.productvalue.purchaserate,
        customerrate: this.productvalue.customerprice,
        rate: this.productvalue.productprice,
        description: this.productvalue.description,
        initialpercentage: 0,
        balancepercentage: 0,
      });
      this.accountsMapping.get('initialpercentage').disable();
      this.accountsMapping.get('balancepercentage').disable();
    }
  }

  get primaryiccid() {
    return this.accountsMapping.get('primaryiccid');
  }

  handleYear(event: boolean) {
    this.endisYear = event;
  }

  updateBalancePercentage() {
    const initialPercentageControl = this.accountsMapping.get(
      'initialpercentage'
    ) as FormControl;
    const balancePercentageControl = this.accountsMapping.get(
      'balancepercentage'
    ) as FormControl;

    const enteredInitialPercentage = initialPercentageControl.value || 0;
    const initialPercentage = Math.min(enteredInitialPercentage, 100);
    let balancePercentage = 100 - initialPercentage;
    balancePercentage = Math.max(0, Math.min(100, balancePercentage));

    initialPercentageControl.setValue(initialPercentage);
    balancePercentageControl.setValue(balancePercentage);

    // Store the balance percentage value in a property for later use in the save method
    this.balance = balancePercentage;
  }

  save(isSave) {

    const selectedCustomer = this.allProvider.find(
      (customer) =>
        customer.companyname === this.accountsMapping.value.simprovider
    );
    this.customervalue = selectedCustomer;
    if (isSave == 'save') {

      var data = [];
      data = [
        {
          id: '',
          productid: this.productvalue.id.toString(),
          customerprice: this.accountsMapping.value.rate.toString(),
          initialpercentage:
            parseInt(this.accountsMapping.value.initialpercentage == undefined
              ? 0
              : this.accountsMapping.value.initialpercentage),
          balancepercentage: parseInt(this.balance == '' ? 0 : this.balance),

          createdby: localStorage.getItem('userName'),
          companyname: this.accountsMapping.value.simprovider,


        },
      ];

      var url =
        ServerUrl.live +
        '/esim/saveCustomerProductPriceMapping?customerid=' +
        this.customervalue.companyid;
      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, data).subscribe((response) => {
        this.loader.dismissLoader();
        if (
          response.message ==
          'Customer product price mapping saved successfully'
        ) {
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
    } else {

      data = [
        {
          id: this.editData.id,
          productid: this.editData.productid.toString(),
          customerprice: this.accountsMapping.value.rate.toString(),
          initialpercentage:
            parseInt(this.accountsMapping.value.initialpercentage == undefined
              ? 0
              : this.accountsMapping.value.initialpercentage),
          balancepercentage: parseInt(this.balance == "" ? this.editData.balancepercentage : this.balance),
          createdby: localStorage.getItem('userName'),
          companyname: this.accountsMapping.value.simprovider,
        },
      ];


      var url =
        ServerUrl.live +
        '/esim/saveCustomerProductPriceMapping?customerid=' +
        this.customervalue.companyid;

      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, data).subscribe((response) => {
        this.loader.dismissLoader();
        if (
          response.message ==
          'Customer product price mapping updated successfully'
        ) {
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
  }

  clear() {
    this.isEdit = false;
    this.accountsMapping.reset();
    this.createForm();
    this.balance = ""
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

  // updateBalancePercentage() {
  //   const initialPercentageControl = this.accountsMapping.get(
  //     'initialpercentage'
  //   ) as FormControl;
  //   const balancePercentageControl = this.accountsMapping.get(
  //     'balancepercentage'
  //   ) as FormControl;
  //   const enteredInitialPercentage = initialPercentageControl.value || 0;
  //   const initialPercentage = Math.min(enteredInitialPercentage, 100);
  //   let balancePercentage = 100 - initialPercentage;
  //   balancePercentage = Math.max(0, Math.min(100, balancePercentage));
  //   initialPercentageControl.setValue(initialPercentage);
  //   balancePercentageControl.setValue(balancePercentage);
  //   this.balance = balancePercentageControl.setValue(balancePercentage);
  // }

  getGridData() {
    this.loader.presentLoader();
    var url =
      ServerUrl.live +
      '/esim/getAllPriceMappingDetail?page=' +
      this.gridPagination.currentPage;
    if (this.gridPagination.isSearched) {
      url = url + '&Search=' + this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      let countUrl = '/esim/getAllCountPriceMappingDetail';
      if (this.gridPagination.isSearched) {
        countUrl = countUrl + '?Search=' + this.gridPagination.searchTerm;
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

    this.editData = e.data;

    let datas = this.allProvider.find((f) => f.companyid == e.data.customerid);
    this.simname = datas;

    let data = this.allProducts.find(
      (f) => f.productname == e.data.productname
    );
    this.planname = data;

    if (this.planname.cardstatus == 'New Sim') {
      this.accountsMapping.patchValue({
        simprovider: this.simname.companyname,
        planname: this.planname.productname,
        accountno: this.planname.purchaserate,
        customerrate: this.planname.customerprice,
        rate: e.data.customerprice,
        description: this.planname.description,
        initialpercentage: e.data.initialpercentage,
        balancepercentage: e.data.balancepercentage,
      });
      this.accountsMapping.get('initialpercentage').enable();
      this.accountsMapping.get('balancepercentage').disable();
    } else {
      this.accountsMapping.patchValue({
        simprovider: this.simname.companyname,
        planname: this.planname.productname,
        accountno: this.planname.purchaserate,
        customerrate: this.planname.customerprice,
        rate: e.data.customerprice,
        description: this.planname.description,
        initialpercentage: e.data.initialpercentage,
        balancepercentage: e.data.balancepercentage,
      });
      this.accountsMapping.get('initialpercentage').disable();
      this.accountsMapping.get('balancepercentage').disable();
    }
    this.isEdit = true;
  }

  handleConfirm(event) {
    this.editData = event.data;
    this.endisConfirm = event;
  }

  toggleConfirm() {
    this.endisConfirm = !this.endisConfirm;
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
      title: 'Customer Price Mapping',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  ngOnInit(): void {
    this.getGridData();
    this.createForm();
    this.getsimprovider();
    this.getproductname();
    this.pagePermission = this.permission.getPermissionDetails(
      'Customer Price Mapping'
    );

    this.columnDefs = [
      {
        headerName: 'Company Name',
        field: 'companyname',
        filter: 'agTextColumnFilter',
        width: 250,
      },
      {
        headerName: 'Customer Id',
        field: 'customerid',
        filter: 'agTextColumnFilter',
        width: 250,
      },
      {
        headerName: 'Product Name',
        field: 'productname',
        filter: 'agTextColumnFilter',
        width: 150,
      },
      {
        headerName: 'Price',
        field: 'customerprice',
        filter: 'agTextColumnFilter',
        width: 150,
      },
      {
        headerName: 'Initial Payment',
        field: 'initialpercentage',
        filter: 'agTextColumnFilter',
        width: 180,
      },
      {
        headerName: 'Balance Payment',
        field: 'balancepercentage',
        filter: 'agTextColumnFilter',
        width: 180,
      },
      {
        headerName: 'Created Date',
        field: 'createddate',
        width: 160,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Created by',
        field: 'createdby',
        width: 250,
        filter: 'agTextColumnFilter',
      },
    ];
    if (this.pagePermission?.edit?.value) {
      this.columnDefs.push({
        width: 100,

        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Edit',
        },
        onCellClicked: this.makeCellClicked.bind(this),
        sortable: false,
      });
    }
  }
}
