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
  selector: 'app-esim-account-mapping',
  templateUrl: './esim-account-mapping.component.html',
  styleUrls: ['./esim-account-mapping.component.scss'],
})
export class EsimAccountMappingComponent {
  selectedMonth: any = '';
  name: boolean = false;
  provider: any = [];
  isFile: boolean = false;
  visible = false;
  dataString: any;
  plan = [];
  endisConfirm: boolean = false;
  value: any;
  endisYear: boolean = false;
  accountsMapping: FormGroup;
  selectedRowSize: number;
  @ViewChild('verticallyCentered', { static: false }) hello;
  @ViewChild('myGrid', { static: false }) myGrid: any;
  @ViewChild('myGrid') grid!: AgGridAngular;
  pagePermission: any;
  rowData = [];

  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService
  ) {}

  columnDefs: any = [
    {
      headerName: 'Sim Provider',
      field: 'provider',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Account No',
      field: 'accountno',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'ICCID No',
      field: 'iccidno',
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Sim No',
      field: 'simno',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Created By',
      field: 'createdby',
      width: 200,
      filter: 'agTextColumnFilter',
    },
  ];

  createForm() {
    this.accountsMapping = this.formBuilder.group({
      simprovider: ['', Validators.required],
      planname: ['', Validators.required],
      accountno: ['', Validators.required],
      fileupload: ['', Validators.required],
    });
    this.accountsMapping.get('planname').disable();
  }

  onFileChange(ev) {
    var fileName = ev.srcElement.files[0];
    this.name = fileName.name.includes('.xlsx');
    if (this.name == true) {
      this.dataString = [];
      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      const file = ev.srcElement.files[0];
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});

        let json = [];
        for (let i = 0; i < jsonData['Sheet1'].length; i++) {
          let newData = {};
          newData['simno'] = jsonData['Sheet1'][i]['simno'].toString();
          json.push(newData);
        }
        if (json.length == 0) {
          this.messageService.add({
            key: 'toast1',
            severity: 'warn',
            summary: 'Warning',
            detail: 'No data available',
          });
        } else {
          this.dataString = json;
        }
        this.dataString = json;
      };
      reader.readAsBinaryString(file);
    } else {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please insert only excel file (.xlsx)',
      });
    }
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
      '/esim/getProviderBillingPlan?provider=' +
      this.accountsMapping.value.simprovider;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      if (res.length > 0) {
        this.accountsMapping.get('planname')?.enable();
        res.map((d) =>
          this.plan.push({
            name: d,
          })
        );
      }
    });
  }

  get primaryiccid() {
    return this.accountsMapping.get('primaryiccid');
  }
  handleYear(event: boolean) {
    this.endisYear = event;
  }

  save() {
    var excellKeyValid = false;
    if (this.dataString.length == 0) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warn',
        detail: 'Sim no not found',
      });
    } else {
      var excellKeys = Object.keys(this.dataString[0]);
      for (var i = 0; i < excellKeys.length; i++) {
        if (excellKeys[i] == 'simno') {
          excellKeyValid = true;
        }
      }

      if (this.name == true && excellKeyValid == true) {
        var data = [];

        this.dataString.map((d) => {
          data.push({
            provider: this.accountsMapping.value.simprovider,
            planname: this.accountsMapping.value.planname,
            accountno: this.accountsMapping.value.accountno,
            simno: d.simno,
            createdby: localStorage.getItem('userName'),
          });
        });

        const url = ServerUrl.live + '/esim/saveEsimAccountMapping';
        this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
          if (res.message == 'Esim Account Mapping Saved Successfully') {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });

            this.clear();
            this.onGridReady();
          } else {
            this.messageService.add({
              key: 'toast1',
              severity: 'error',
              summary: 'Error',
              detail: res.message,
            });
          }
        });
      }
    }
  }

  clear() {
    this.accountsMapping.reset();
    this.createForm();
  }

  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };

  downloadExcel() {
    const link = document.createElement('a');
    link.href =
      'https://kingstrackimages.s3.ap-southeast-1.amazonaws.com/EsimExcelDowmload/EsimSimNo.xlsx';
    link.download = 'sample.xlsx';
    link.click();
  }
  onGridReady() {
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/getAllEsimAccountMapping';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.loader.dismissLoader();
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
      title: 'Esim Accounts Mapping',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
    this.clear();
  }

  ngOnInit(): void {
    this.createForm();
    this.getsimprovider();
    this.pagePermission = this.permission.getPermissionDetails(
      'Esim Account Mapping'
    );
    // this.checkinForm = this.formBuilder.group({
    //   searchprimaryiccid: ['', Validators.required],
    // });
  }
}
