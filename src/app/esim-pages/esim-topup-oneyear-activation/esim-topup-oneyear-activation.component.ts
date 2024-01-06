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
  selector: 'app-esim-topup-oneyear-activation',
  templateUrl: './esim-topup-oneyear-activation.component.html',
  styleUrls: ['./esim-topup-oneyear-activation.component.scss'],
})
export class EsimTopupOneyearActivationComponent {
  months: any = [];

  selectedMonth: any = '';
  selectedRowSize: number;
  pagePermission: any;

  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService
  ) {}
  @ViewChild('myGrid', { static: false }) myGrid: any;
  endisConfirm: boolean = false;
  visible = false;
  rowData = [];
  modelData: any = '';
  endisYear: boolean = false;
  dataString: any;
  liveDemoVisible = false;
  isFile: boolean = false;
  value: any;
  name: boolean = false;
  iccidFinder = '';
  savesimForm: FormGroup;
  columnDefs: any;
  @ViewChild('myGrid') grid!: AgGridAngular;

  clearPlan() {
    this.selectedMonth = '';
  }
  savePlans() {
    const arr = [];

    arr.push({
      iccid: this.modelData.primaryiccid,
      topupvaliditymonth: this.selectedMonth.name,
      createdby: localStorage.getItem('userName'),
    });

    const url = ServerUrl.live + '/esim/saveEsimTopupHistory';
    this.ajaxService.ajaxPostWithBody(url, arr).subscribe((res) => {
      if (res.message == 'Success') {
        this.modelData = '';
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: 'Topped up successfully ',
        });
        this.modelData = '';
        this.selectedMonth = '';
        this.toggleYear();
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

  saveOneYear() {
    const arr = [];

    arr.push({
      iccid: this.modelData.primaryiccid,
      topupvalidityyear: '1 Year',
      createdby: localStorage.getItem('userName'),
    });

    const url = ServerUrl.live + '/esim/saveEsimExtendOneyrHistory';
    this.ajaxService.ajaxPostWithBody(url, arr).subscribe((res) => {
      if (res.message == 'Success') {
        this.modelData = '';
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: 'Extended 1yr successfully ',
        });
        this.modelData = '';
        this.selectedMonth = '';
        this.toggleConfirm();
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

  get primaryiccid() {
    return this.savesimForm.get('primaryiccid');
  }
  onFileChange(ev) {
    var fileName = ev.srcElement.files[0];
    this.name = fileName.name.includes('.xlsx');
    if (this.name == true) {
      this.isFile = true;
      this.primaryiccid.clearValidators();
      this.primaryiccid.updateValueAndValidity();
      this.primaryiccid.disable();
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
          newData['iccidno'] = jsonData['Sheet1'][i]['iccidno'].toString();
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

  clearIccid() {
    this.iccidFinder = '';
  }

  search() {
    if (this.iccidFinder.length != 20) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Enter the 20 Digit ICCID No',
      });
    } else {
      var url = ServerUrl.live + '/esim/simdetails?iccidNo=' + this.iccidFinder;
      this.ajaxService.ajaxget(url).subscribe((res) => {
        if (Object.keys(res).length == 0) {
          this.messageService.add({
            key: 'toast1',
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please Check the Iccid Number',
          });
        } else {
          this.value = res;
          this.liveDemoVisible = !this.liveDemoVisible;
        }
      });
    }
  }

  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };

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
      title: 'Esim Topup OneYear Activation',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  onGridReady() {
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/getActivatedEsimDetails';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.loader.dismissLoader();
    });
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  makeCellClicked(e) {
    this.modelData = e.data;
    this.endisYear = !this.endisYear;
  }

  toggleLiveDemo() {
    this.liveDemoVisible = !this.liveDemoVisible;
  }
  toggleYear() {
    this.endisYear = !this.endisYear;
  }
  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }
  handleYear(event: boolean) {
    this.endisYear = event;
  }
  handleConfirm(event) {
    this.modelData = event.data;
    this.endisConfirm = event;
  }
  toggleConfirm() {
    this.endisConfirm = !this.endisConfirm;
  }

  ngOnInit(): void {
    this.months = [
      { name: '1 Month' },
      { name: '2 Month' },
      { name: '3 Month' },
      { name: '4 Month' },
      { name: '5 Month' },
      { name: '6 Month' },
      { name: '7 Month' },
      { name: '8 Month' },
      { name: '9 Month' },
      { name: '10 Month' },
      { name: '11 Month' },
    ];
    this.pagePermission = this.permission.getPermissionDetails(
      'Esim Topup/1Yr Activation'
    );

    this.columnDefs = [
      {
        headerName: 'Primary ICCID',
        field: 'primaryiccid',
        filter: 'agTextColumnFilter',
        width: 190,
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
        filter: 'agTextColumnFilter',
        width: 160,
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
        width: 180,
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
        width: 160,

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
        width: 125,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Expired On',
        field: 'expiredon',
        width: 120,
        filter: 'agTextColumnFilter',
      },
    ];

    if (this.pagePermission.topup.value) {
      this.columnDefs.push({
        width: 120,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Topup',
        },
        onCellClicked: this.makeCellClicked.bind(this),
        sortable: false,
      });
    }
    if (this.pagePermission.extendoneyear.value) {
      this.columnDefs.push({
        width: 150,

        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Extend 1 Yr',
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
