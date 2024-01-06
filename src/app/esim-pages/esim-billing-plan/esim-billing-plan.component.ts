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
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';

import * as XLSX from 'xlsx';

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
  selector: 'app-esim-billing-plan',
  templateUrl: './esim-billing-plan.component.html',
  styleUrls: ['./esim-billing-plan.component.scss'],
})
export class EsimBillingPlanComponent {
  selectedMonth: any = '';

  provider: any = [];
  editData;
  visible = false;
  dataString: any;

  endisConfirm: boolean = false;
  value: any;
  isEdit: boolean = false;
  endisYear: boolean = false;
  saveBillingPlan: FormGroup;

  @ViewChild('verticallyCentered', { static: false }) hello;
  selectedRowSize: number;
  columnDefs: any;
  pagePermission: any;
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService
  ) {}

  @ViewChild('myGrid') grid!: AgGridAngular;
  @ViewChild('myGrid', { static: false }) myGrid: any;

  createForm() {
    this.saveBillingPlan = this.formBuilder.group({
      simprovider: ['', Validators.required],
      planname: ['', Validators.required],
      planamount: ['', Validators.required],
    });
  }

  getsimprovider() {
    var url = ServerUrl.live + '/esim/getEsimProvider';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      res.map((d) =>
        this.provider.push({
          name: d,
        })
      );
    });
  }

  get primaryiccid() {
    return this.saveBillingPlan.get('primaryiccid');
  }
  handleYear(event: boolean) {
    this.endisYear = event;
  }

  save(isSave) {
    var data;
    if (isSave == 'save') {
      data = {
        planid: '',
        planname: this.saveBillingPlan.value.planname.toString(),
        provider: this.saveBillingPlan.value.simprovider.toString(),
        planamount: this.saveBillingPlan.value.planamount.toString(),
        createdby: localStorage.getItem('userName'),
      };
    } else {
      data = {
        planid: this.editData.planid.toString(),
        planname: this.saveBillingPlan.value.planname.toString(),
        provider: this.saveBillingPlan.value.simprovider.toString(),
        planamount: this.saveBillingPlan.value.planamount.toString(),
        createdby: localStorage.getItem('userName'),
      };
    }

    var url = ServerUrl.live + '/esim/saveEsimBillingPlan';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((response) => {
      if (response.message == 'Esim Billing Plan Saved Successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });

        this.clear();
        this.onGridReady();
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
  clear() {
    this.isEdit = false;
    this.saveBillingPlan.reset();
    this.createForm();
  }

  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };
  rowData = [];
  onGridReady() {
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/getEsimBillingPlan';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.loader.dismissLoader();
    });
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
    this.saveBillingPlan.patchValue({
      simprovider: e.data.provider,
      planname: e.data.planname,
      planamount: e.data.planamount,
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
    var arr = [];
    arr.push({
      provider: this.editData.provider,
      planname: this.editData.planname,
      planamount: this.editData.planamount,
    });
    const url =
      ServerUrl.live +
      '/esim/DeleteEsimBillingPlan?planid=' +
      this.editData.planid;
    this.ajaxService.ajaxPostWithBody(url, arr).subscribe((response) => {
      if (response.message == 'Esim Billing Plan Deleted Successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.editData = '';
        this.selectedMonth = '';
        this.toggleConfirm();
        this.onGridReady();
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
      title: 'Esim Billing Plan',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  ngOnInit(): void {
    this.createForm();
    this.getsimprovider();
    this.pagePermission =
      this.permission.getPermissionDetails('Esim Billing Plan');
    this.columnDefs = [
      {
        headerName: 'Sim Provider',
        field: 'provider',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Plan Name',
        field: 'planname',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Plan Amount',
        field: 'planamount',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Created By',
        field: 'createdby',
        width: 200,
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
    if (this.pagePermission?.delete?.value) {
      this.columnDefs.push({
        width: 120,

        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Delete',
        },
        onCellClicked: this.handleConfirm.bind(this),
        sortable: false,
      });
    }

    // this.checkinForm = this.formBuilder.group({
    //   searchprimaryiccid: ['', Validators.required],
    // });
  }
}
