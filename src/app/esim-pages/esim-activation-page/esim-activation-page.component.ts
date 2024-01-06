import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { LoaderService } from 'src/app/service/loader.service';
import { ServerUrl } from 'src/environment';
import { cilList, cilShieldAlt } from '@coreui/icons';
import * as XLSX from 'xlsx';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { PermissionService } from 'src/app/service/permission.service';
import * as moment from 'moment';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
import { GridPaginationService } from 'src/app/service/grid-pagination.service';
// define cellRenderer to be reused
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
  selector: 'app-esim-activation-page',
  templateUrl: './esim-activation-page.component.html',
  styleUrls: ['./esim-activation-page.component.scss'],
})
export class EsimActivationPageComponent implements OnInit {
  icons = { cilList, cilShieldAlt };
  rowDataHistory: any[] = [];
  visible = false;
  dataString: any;
  liveDemoVisible: boolean = false;
  isFile: boolean = false;
  value: any;
  isEdit: boolean = false;
  iccidFinder = '';
  iccid: string;
  savesimForm: FormGroup;
  name: boolean = false;
  pagePermissions: any;
  @ViewChild('verticallyCentered', { static: false }) hello;
  selectedRowSize: number;
  availablePermissions: any;
  columnDefs = [];
  columnDefsHistory = [];
  historyVisible: boolean = false;
  gridApi: any;
  rowData = [];
  @ViewChild('myGrid', { static: false }) myGrid: any;
  @ViewChild('myGrid') grid!: AgGridAngular;

  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permissions: PermissionService,
    private gridService: AgGridService,
    public gridPagination:GridPaginationService
  ) {}

  // dateValidation(type) {
  //   let activate = this.savesimForm.get('activateon');
  //   let expire = this.savesimForm.get('expiredon');

  //   if (type == 'activate') {
  //     const year = activate.value;
  //     if (
  //       (new String(year) && new String(year).slice(0, 2) === '00') ||
  //       (activate &&
  //         activate.value &&
  //         !moment(activate.value, 'YYYY-MM-DD', true).isValid())
  //     ) {
  //       activate.setErrors({ invalidYear: true });
  //     } else if (activate.value > expire.value) {
  //       activate?.setErrors({ invalidDate: true });
  //     } else {
  //       expire?.setErrors(null);
  //       activate?.setErrors(null);
  //     }
  //   } else {
  //     const year = expire.value;
  //     if (
  //       (new String(year) && new String(year).slice(0, 2) === '00') ||
  //       (expire &&
  //         expire.value &&
  //         !moment(expire.value, 'YYYY-MM-DD', true).isValid())
  //     ) {
  //       expire.setErrors({ invalidYear: true });
  //     } else if (expire.value < activate.value) {
  //       expire?.setErrors({ invalidDate: true });
  //     } else {
  //       if (activate['errors'] != null) {
  //         if (!activate?.errors['invalidYear']) {
  //           activate.setErrors(null);
  //         }
  //       }

  //       expire?.setErrors(null);
  //     }
  //   }
  // }
  // createForm() {
  //   var now = new Date();
  //   var day = ('0' + now.getDate()).slice(-2);
  //   var month = ('0' + (now.getMonth() + 1)).slice(-2);
  //   var today = now.getFullYear() + '-' + month + '-' + day;
  //   var todaytime = now.getHours() + ':' + now.getMinutes();
  //   this.savesimForm = this.formBuilder.group({
  //     primaryiccid: ['', Validators.required],
  //     fileupload: [''],
  //     activateon: [today, Validators.required],
  //     expiredon: [today, Validators.required],
  //   });
  // }

  getIccidHistory(ev) {
    this.iccid = ev.data.primaryiccid;
    //let url = ServerUrl.live + "/esim/getAllHistory?iccid=12345678909876543211"
    let url = ServerUrl.live + '/esim/getAllHistory?iccid=' + this.iccid;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.historyVisible = true;
      this.rowDataHistory = res;
    });
  }
  // get primaryiccid() {
  //   return this.savesimForm.get('primaryiccid');
  // }
  // onFileChange(ev) {
  //   var fileName = ev.srcElement.files[0];
  //   this.name = fileName.name.includes('.xlsx');
  //   if (this.name == true) {
  //     this.isFile = true;
  //     this.primaryiccid.clearValidators();
  //     this.primaryiccid.reset();
  //     this.primaryiccid.updateValueAndValidity();
  //     this.primaryiccid.disable();
  //     this.dataString = [];
  //     let workBook = null;
  //     let jsonData = null;
  //     const reader = new FileReader();
  //     const file = ev.srcElement.files[0];
  //     reader.onload = (event) => {
  //       const data = reader.result;
  //       workBook = XLSX.read(data, { type: 'binary' });
  //       jsonData = workBook.SheetNames.reduce((initial, name) => {
  //         const sheet = workBook.Sheets[name];
  //         initial[name] = XLSX.utils.sheet_to_json(sheet);
  //         return initial;
  //       }, {});

  //       let json = [];
  //       for (let i = 0; i < jsonData['Sheet1'].length; i++) {
  //         let newData = {};
  //         newData['iccidno'] = jsonData['Sheet1'][i]['iccidno'].toString();
  //         json.push(newData);
  //       }

  //       if (json.length == 0) {
  //         this.messageService.add({
  //           key: 'toast1',
  //           severity: 'warn',
  //           summary: 'Warning',
  //           detail: 'No data available',
  //         });
  //       } else {
  //         this.dataString = json;
  //       }
  //     };
  //     reader.readAsBinaryString(file);
  //   } else {
  //     this.messageService.add({
  //       key: 'toast1',
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail: 'Please insert only excel file (.xlsx)',
  //     });
  //   }
  // }
  downloadExcel() {
    const link = document.createElement('a');
    link.href =
      'https://kingstrackimages.s3.ap-southeast-1.amazonaws.com/EsimExcelDowmload/EsimICCID.xlsx';
    link.download = 'sample.xlsx';
    link.click();
  }
  // upload() {
  //   if (
  //     this.savesimForm.value.primaryiccid == '' ||
  //     this.savesimForm.value.primaryiccid == undefined
  //   ) {
  //     if (this.isFile) {
  //       let arr = [];
  //       this.dataString.map((d) => {
  //         var data = {
  //           primaryiccid: d.iccidno.toString(),
  //           activateon: this.savesimForm.value.activateon.toString(),
  //           expiredon: this.savesimForm.value.expiredon.toString(),
  //         };
  //         arr.push(data);
  //       });
  //       var url = ServerUrl.live + '/esim/savesimdetails';
  //       this.ajaxService
  //         .ajaxPostWithBody(url, JSON.stringify(arr))
  //         .subscribe((response) => {
  //           if (response.message == 'Success') {
  //             this.messageService.add({
  //               key: 'toast1',
  //               severity: 'success',
  //               summary: 'Success',
  //               detail: 'Sim Details Saved Successfully',
  //             });
  //             this.onGridReady();
  //             this.clear();
  //           } else {
  //             this.messageService.add({
  //               key: 'toast1',
  //               severity: 'error',
  //               summary: 'Error',
  //               detail: response.message,
  //             });
  //           }
  //         });
  //     }
  //   } else {
  //     if (this.savesimForm.value.primaryiccid.toString().length != 20) {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'warn',
  //         summary: 'Warn',
  //         detail: 'Enter the 20 Digit ICCID No',
  //       });
  //     } else {
  //       let arr = [];
  //       arr.push({
  //         primaryiccid: this.savesimForm.value.primaryiccid.toString(),
  //         activateon: this.savesimForm.value.activateon.toString(),
  //         expiredon: this.savesimForm.value.expiredon.toString(),
  //       });

  //       var url = ServerUrl.live + '/esim/savesimdetails';
  //       this.ajaxService.ajaxPostWithBody(url, arr).subscribe((response) => {
  //         if (response.message == 'Success') {
  //           this.messageService.add({
  //             key: 'toast1',
  //             severity: 'success',
  //             summary: 'Success',
  //             detail: 'Sim Details Saved Successfully',
  //           });

  //           this.clear();
  //           this.onGridReady();
  //         } else {
  //           this.messageService.add({
  //             key: 'toast1',
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: response.message,
  //           });
  //         }
  //       });
  //     }
  //   }
  // }
  // clear() {
  //   this.isEdit = false;
  //   this.savesimForm.reset();
  //   this.createForm();
  // }
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
  };

  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }

  getGridData() {
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/getActivatedEsimDetails?page='+this.gridPagination.currentPage;
    if(this.gridPagination.isSearched){
      url=url+"&Search="+this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      var countUrl="/esim/getActivatedCountEsimDetails";
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

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData();
  }
  // toggleCollapse(): void {
  //   this.visible = !this.visible;
  //   this.clear();
  //   this.clearIccid();
  // }
  // makeCellClicked(e) {
  //   this.clear();
  //   if (this.visible == false) {
  //     this.visible = true;
  //   }
  //   // Assuming the input format is dd-mm-yyyy

  //   // Split the date string and reorder the parts
  //   var date1 = e.data.activateon.split('-');
  //   var activateon = date1[2] + '-' + date1[1] + '-' + date1[0];
  //   var date2 = e.data.expiredon.split('-');
  //   var expiredon = date2[2] + '-' + date2[1] + '-' + date2[0];

  //   this.savesimForm.patchValue({
  //     primaryiccid: e.data.primaryiccid,
  //     activateon: activateon,
  //     expiredon: expiredon,
  //   });
  //   this.isEdit = true;
  // }
  // edit() {
  //   if (
  //     this.savesimForm.value.primaryiccid == '' ||
  //     this.savesimForm.value.primaryiccid == undefined
  //   ) {
  //     if (this.isFile) {
  //       let arr = [];
  //       this.dataString.map((d) => {
  //         var data = {
  //           primaryiccid: d.iccidno.toString(),
  //           activateon: this.savesimForm.value.activateon.toString(),
  //           expiredon: this.savesimForm.value.expiredon.toString(),
  //           createdby: localStorage['userName'],
  //         };
  //         arr.push(data);
  //       });
  //       var url = ServerUrl.live + '/esim/savesimdetails?edit=1';
  //       this.ajaxService
  //         .ajaxPostWithBody(url, JSON.stringify(arr))
  //         .subscribe((response) => {
  //           if (response.message == 'Success') {
  //             this.messageService.add({
  //               key: 'toast1',
  //               severity: 'success',
  //               summary: 'Success',
  //               detail: 'Sim Details Saved Successfully',
  //             });
  //             this.clear();
  //           } else {
  //             this.messageService.add({
  //               key: 'toast1',
  //               severity: 'error',
  //               summary: 'Error',
  //               detail: response.message,
  //             });
  //           }
  //         });
  //     }
  //   } else {
  //     if (this.savesimForm.value.primaryiccid.toString().length != 20) {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'warn',
  //         summary: 'Warn',
  //         detail: 'Enter the 20 Digit ICCID No',
  //       });
  //     } else {
  //       let arr = [];
  //       arr.push({
  //         primaryiccid: this.savesimForm.value.primaryiccid.toString(),
  //         activateon: this.savesimForm.value.activateon.toString(),
  //         expiredon: this.savesimForm.value.expiredon.toString(),
  //         createdby: localStorage['userName'],
  //       });

  //         var url = ServerUrl.live + '/esim/savesimdetails?edit=1';
  // this.ajaxService.ajaxPostWithBody(url, arr).subscribe((response) => {
  //   if (response.message == 'Success') {
  //     this.messageService.add({
  //       key: 'toast1',
  //       severity: 'success',
  //       summary: 'Success',
  //       detail: 'Sim Details Saved Successfully',
  //     });

  //     this.clear();
  //     this.onGridReady();
  //   } else {
  //     this.messageService.add({
  //       key: 'toast1',
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: response.message,
  //     });
  //   }
  // });
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
      title: 'Esim Activation Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  toggleLiveDemo() {
    this.liveDemoVisible = !this.liveDemoVisible;
  }
  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }
  handleHistoryModal(event: boolean) {
    this.historyVisible = event;
  }

  ngOnInit(): void {
    //this.createForm();
    this.pagePermissions = this.permissions.getPermissionDetails(
      'Esim Activation History'
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
      {
        width: 165,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'View History',
        },
        onCellClicked: this.getIccidHistory.bind(this),
        sortable: false,
      },
    ];
    // if (this.pagePermissions?.edit?.value == true) {
    //   this.columnDefs.push({
    //     width: 100,

    //     cellRenderer: ColourCellRenderer,
    //     cellRendererParams: {
    //       text: 'Edit',
    //     },
    //     onCellClicked: this.makeCellClicked.bind(this),
    //     sortable: false,
    //   });
    //}

    this.columnDefsHistory = [
      {
        headerName: 'Primary ICCID',
        field: 'iccidno',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Card State',
        field: 'cardstate',
        filter: 'agTextColumnFilter',
        width: 120,
      },
      {
        headerName: 'Card Status',
        field: 'cardstatus',
        filter: 'agTextColumnFilter',
        width: 140,
      },
      {
        headerName: 'Activated on',
        field: 'activatedon',
        filter: 'agTextColumnFilter',
        width: 140,
      },
      {
        headerName: 'Expired on',
        field: 'expiredon',
        filter: 'agTextColumnFilter',
        width: 140,
      },
      {
        headerName: 'Extended validity',
        field: 'extendedvalidity',
        filter: 'agTextColumnFilter',
        width: 170,
      },
      {
        headerName: 'Validity type',
        field: 'validitytype',
        filter: 'agTextColumnFilter',
        width: 150,
      },
      {
        headerName: 'Previously Activated on',
        field: 'previousactivatedon',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Previous Expired on',
        field: 'previousexpiredon',
        filter: 'agTextColumnFilter',
        width: 200,
      },
      {
        headerName: 'Created by',
        field: 'createdby',
        filter: 'agTextColumnFilter',
        width: 140,
      },
      {
        headerName: 'Created date',
        field: 'createddate',
        filter: 'agTextColumnFilter',
        width: 140,
      },
    ];
  }
}
