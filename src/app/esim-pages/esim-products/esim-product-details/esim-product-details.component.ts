import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
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
  selector: 'app-esim-product-details',
  templateUrl: './esim-product-details.component.html',
  styleUrls: ['./esim-product-details.component.scss'],
})
export class EsimProductDetailsComponent implements OnInit {
  @ViewChild('myGrid', { static: false }) myGrid: any;
  pagePermission: any;
  selectedRowSize = 10;
  rowData = [];
  endisConfirm: boolean = false;
  editData;
  formAction = 'new';
  visible = false;
  saveProductDetails: FormGroup;
  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  columnDefs: any;
  esimStatus: any;
  gridApi: any;

  Topupplans = [
    {
      planValue: '1 Year',
      years: '1 Year',
    },
    {
      planValue: '2 Year',
      years: '2 Year',
    },
    {
      planValue: '3 Year',
      years: '3 Year',
    },
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
  visibleLoader: boolean;

  constructor(
    private permission: PermissionService,
    private loader: LoaderService,
    private ajaxService: AjaxService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private gridService: AgGridService,
    public gridPagination:GridPaginationService
  ) {}

  edit(e) {
    this.toggleModal();
    this.editData = e.data;
    this.formAction = 'edit';
    this.saveProductDetails.patchValue({
      productname: e.data.productname,
      description: e.data.description,
      productprice: e.data.customerprice.replace(/,/g, ''),
      purchaserate: e.data.purchaserate,
      validityperiod: e.data.validityperiod,
      cardstatus: e.data.cardstatus,
      minorderqty: e.data.minorderqty,
      createdby: e.data.createdby,
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
      title: 'Product Detail',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  toggleModal() {
    this.formAction = 'new';
    if (!this.visible) {
      this.visibleLoader = !this.visible;
      setTimeout(() => (this.visible = !this.visible), 200);
    } else {
      this.visible = !this.visible;
    }
    this.clear();
    this.createForm();
  }

  handleModalChange(event: any) {
    this.visible = event;
  }
  clear() {
    this.saveProductDetails.reset();
  }

  getEsimStatus() {
    let url = ServerUrl.live + '/esim/getEsimCardStatus';
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.esimStatus = res;
    });
  }
  submit(d) {
    this.loader.presentLoader();
    if (d == 'edit') {
      let { id, productprice, minorderqty, purchaserate, ...rest } =
        this.saveProductDetails.value;

      let data = {
        ...rest,
        id: this.editData.id.toString(),
        productprice: this.saveProductDetails.value.productprice.toString(),
        minorderqty: this.saveProductDetails.value.minorderqty.toString(),
        purchaserate: this.saveProductDetails.value.purchaserate.toString(),
        validityperiod: this.saveProductDetails.value.validityperiod.toString(),
      };

      var url = ServerUrl.live + '/esim/saveProductDetail';
      this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'Product details edited Successfully') {
          this.messageService.add({
            key: 'toast1',
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.toggleModal();
          this.getGridData();
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
      let { productprice, minorderqty, purchaserate, ...rest } =
        this.saveProductDetails.value;

      let data = {
        ...rest,
        purchaserate: this.saveProductDetails.value.purchaserate.toString(),
        productprice: this.saveProductDetails.value.productprice.toString(),
        minorderqty: this.saveProductDetails.value.minorderqty.toString(),
        validityperiod: this.saveProductDetails.value.validityperiod.toString(),
      };

      var url = ServerUrl.live + '/esim/saveProductDetail';
      this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'Product details saved Successfully') {
          this.messageService.add({
            key: 'toast1',
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.toggleModal();
          this.getGridData();
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
  onCancel() {
    this.clear();
    this.toggleModal();
  }

  delete() {
    var url =
      ServerUrl.live +
      '/esim/deleteProductDetail?id=' +
      this.editData.id.toString();
    this.ajaxService.ajaxdelete(url).subscribe((res) => {
      if (res.message == 'Product deleted successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
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
  handleConfirm(event) {
    this.editData = event.data;
    this.endisConfirm = event;
  }
  toggleConfirm() {
    this.endisConfirm = !this.endisConfirm;
  }

  createForm() {
    this.saveProductDetails = this.formBuilder.group({
      id: [''],
      productname: ['', Validators.required],
      description: ['', Validators.required],
      productprice: ['', Validators.required],
      minorderqty: ['', Validators.required],
      purchaserate: ['', Validators.required],
      validityperiod: ['', Validators.required],
      cardstatus: ['', Validators.required],
      createdby: [localStorage.getItem('userName')],
    });
  }
  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }

  getGridData() {
    this.loader.presentLoader();
    var url =
      ServerUrl.live +
      '/esim/getAllProductDetail?userId=' +
      localStorage['userName']+"&page="+this.gridPagination.currentPage;
    if(this.gridPagination.isSearched){
      url=url+"&Search="+this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      let countUrl='/esim/getAllCountProductDetail?userId=' +
      localStorage['userName']
      if(this.gridPagination.isSearched){
        countUrl=countUrl+"?Search="+this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      setTimeout(() => {
        this.gridService.autoSizeColumns(this.gridApi);
      }, 0);
      this.loader.dismissLoader();
    });
  }

  ngOnInit(): void {
    this.getGridData();
    this.pagePermission =
      this.permission.getPermissionDetails('Product Detail');
    this.getEsimStatus();
    this.createForm();
    this.columnDefs = [
      {
        headerName: 'Product Name',
        field: 'productname',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Description',
        field: 'description',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Purchase Rate',
        field: 'purchaserate',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Product Price',
        field: 'customerprice',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Minimum Order Quantity',
        field: 'minorderqty',
        filter: 'agTextColumnFilter',
        width: 230,
      },
    ];
    if (this.pagePermission?.edit?.value == true) {
      this.columnDefs.push({
        headerName: '',
        field: '',
        width: 100,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'edit',
        },
        onCellClicked: this.edit.bind(this),
        sortable: false,
      });
    }
    if (this.pagePermission?.delete?.value == true) {
      this.columnDefs.push({
        headerName: '',
        field: '',
        width: 120,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'delete',
        },
        onCellClicked: this.handleConfirm.bind(this),
        sortable: false,
      });
    }
  }

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData();
  }
}
