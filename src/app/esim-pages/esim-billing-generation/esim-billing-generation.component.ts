import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-esim-billing-generation',
  templateUrl: './esim-billing-generation.component.html',
  styleUrls: ['./esim-billing-generation.component.scss'],
})
export class EsimBillingGenerationComponent {
  selectedMonth: any = '';
  pagePermission: any;
  name: boolean = false;
  provider: any = [];
  isFile: boolean = false;
  visible = false;
  dataString: any;
  plan = [];
  endisConfirm: boolean = false;
  value: any;

  endisYear: boolean = false;
  billingGereration: FormGroup;

  @ViewChild('verticallyCentered', { static: false }) hello;
  selectedRowSize: number;
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService
  ) {}
  @ViewChild('myGrid', { static: false }) myGrid: any;
  @ViewChild('myGrid') grid!: AgGridAngular;
  columnDefs: any = [
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
      width: 120,
    },
    {
      headerName: 'Account No',
      field: 'accountno',
      filter: 'agTextColumnFilter',
      width: 120,
    },
    { headerName: 'Sim No', field: 'simno', filter: 'agTextColumnFilter' },
    {
      headerName: 'From Date',
      field: 'fromdate',
      width: 120,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'To Date',
      field: 'todate',
      width: 120,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 120,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Created by',
      field: 'createdby',
      width: 120,
      filter: 'agTextColumnFilter',
    },
  ];

  dateValidation(type) {
    let from = this.billingGereration.get('fromdate');
    let to = this.billingGereration.get('todate');

    if (type == 'from') {
      const year = new String(from.value);
      if (
        (year && year.toString().slice(0, 2) === '00') ||
        (from &&
          from.value &&
          !moment(from.value, 'YYYY-MM-DD', true).isValid())
      ) {
        from.setErrors({ invalidYear: true });
      } else if (from.value > to.value) {
        from?.setErrors({ invalidDate: true });
      } else {
        to?.setErrors(null);
        from?.setErrors(null);
      }
    } else {
      const year = new String(to.value);
      if (
        (year && year.slice(0, 2) === '00') ||
        (to && to.value && !moment(to.value, 'YYYY-MM-DD', true).isValid())
      ) {
        to.setErrors({ invalidYear: true });
      } else if (to.value < from.value) {
        to?.setErrors({ invalidDate: true });
      } else {
        if (from?.errors != null) {
          if (!from?.errors['invalidYear']) {
            from.setErrors(null);
          }
        }
      }
    }
  }

  createForm() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    var todaytime = now.getHours() + ':' + now.getMinutes();
    this.billingGereration = this.formBuilder.group({
      simprovider: ['', Validators.required],
      accountno: ['', Validators.required],
      fromdate: [today, Validators.required],
      todate: [today, Validators.required],
    });
    this.billingGereration.get('accountno').disable();
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

  getPlan() {
    this.plan = [];
    var url =
      ServerUrl.live +
      '/esim/getProviderAccountNo?provider=' +
      this.billingGereration.value.simprovider;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      if (res.length > 0) {
        this.billingGereration.get('accountno')?.enable();

        res.map((d) =>
          this.plan.push({
            name: d,
          })
        );
      } else {
        // this.billingGereration.get('accountno')?.disable();
      }
    });
  }
  get primaryiccid() {
    return this.billingGereration.get('primaryiccid');
  }
  handleYear(event: boolean) {
    this.endisYear = event;
  }

  save() {
    this.loader.presentLoader();
    var data = {
      provider: this.billingGereration.value.simprovider.toString(),
      accountno: this.billingGereration.value.accountno.toString(),
      fromdate: this.billingGereration.value.fromdate.toString(),
      todate: this.billingGereration.value.todate.toString(),
      createdby: localStorage.getItem('userName'),
    };

    const url = ServerUrl.live + '/esim/getEsimBillingGeneration';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      if (res.length > 0) {
        this.toggleCollapse();
        this.rowData = res;
        this.loader.dismissLoader();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: 'No data available',
        });
        this.loader.dismissLoader();
      }
    });
  }
  clear() {
    this.billingGereration.reset();
    this.createForm();
    this.rowData = [];
    this.visible = false;
  }

  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };
  rowData = [];
  onFirstDataRendered(params): void {
    params.api.sizeColumnsToFit();
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
      title: 'Esim Billing Generation',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  toggleCollapse(): void {
    this.visible = true;
  }

  ngOnInit(): void {
    this.pagePermission = this.permission.getPermissionDetails(
      'Esim Billing Generation'
    );
    this.createForm();
    this.getsimprovider();

    // this.checkinForm = this.formBuilder.group({
    //   searchprimaryiccid: ['', Validators.required],
    // });
  }
}
