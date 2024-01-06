import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { LoaderService } from 'src/app/service/loader.service';
import { GridPaginationService } from 'src/app/service/grid-pagination.service';
import { ServerUrl } from 'src/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sim-details-upload',
  templateUrl: './sim-details-upload.component.html',
  styleUrls: ['./sim-details-upload.component.scss'],
})
export class SimDetailsUploadComponent {
  name: boolean = false;
  isFile: boolean = false;
  dataString: any;
  file: any;
  isSubmitDisabled: boolean;
  selectedRowSize: any;

  willDownload = false;

  output = '';

  show: boolean = false;
  imeiIssues = [];
  excellKeyValid: boolean = false;

  @ViewChild('myGrid', { static: false }) myGrid: any;
  columnDefs = [
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
  tabs: any = [{ label: 'Un-Assigned' }, { label: 'Assigned' }];
  unassignedData: any[] = [];
  assignedData: any[] = [];
  activeTab: any;
  pagename: string;
  gridApi: any;

  tabChanged(event: any) {
    if (event.label == 'Un-Assigned') {
      this.activeTab = this.tabs[0];
      this.getGridData();
    } else if (event.label == 'Assigned') {
      this.activeTab = this.tabs[1];
      this.getGridData();
    }
  }

  filterGrid(arg0: string) {
    throw new Error('Method not implemented.');
  }

  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  rowData = [];
  constructor(
    private messageService: MessageService,
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private excel: ExportExcelService,
    public gridPagination: GridPaginationService
  ) { }
  onFileChange(ev) {
    var fileName = ev.srcElement.files[0];
    this.name = fileName.name.includes('.xlsx');
    if (this.name == true) {
      this.isFile = true;
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
          for (var propt in jsonData['Sheet1'][i]) {
            newData['primaryiccid'] =
              jsonData['Sheet1'][i]['primaryiccid'].toString();
            newData['primarytsp'] =
              jsonData['Sheet1'][i]['primarytsp'].toString();
            newData['primarymsisdn'] =
              jsonData['Sheet1'][i]['primarymsisdn'].toString();
            newData['primarystatus'] =
              jsonData['Sheet1'][i]['primarystatus'].toString();
            newData['fallbackiccid'] =
              jsonData['Sheet1'][i]['fallbackiccid'].toString();
            newData['fallbacktsp'] =
              jsonData['Sheet1'][i]['fallbacktsp'].toString();
            newData['fallbackmsisdn'] =
              jsonData['Sheet1'][i]['fallbackmsisdn'].toString();
            newData['fallbackstatus'] =
              jsonData['Sheet1'][i]['fallbackstatus'].toString();
          }
          newData = jsonData['Sheet1'][i];
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
      this.isSubmitDisabled = true; // Disable the submit button
    }
  }
  upload() {
    if (this.dataString.length == 0) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: "Check your excell file,don't enter blank spaces",
      });
    } else {
      var excellKeys = Object.keys(this.dataString[0]);
      for (var i = 0; i < excellKeys.length; i++) {
        if (
          excellKeys[i] == 'primaryiccid' ||
          excellKeys[i] == 'primarytsp' ||
          excellKeys[i] == 'primarymsisdn' ||
          excellKeys[i] == 'primarystatus' ||
          excellKeys[i] == 'fallbackiccid' ||
          excellKeys[i] == 'fallbacktsp' ||
          excellKeys[i] == 'fallbackmsisdn' ||
          excellKeys[i] == 'fallbackstatus'
        ) {
          console.log('present');
          this.excellKeyValid = true;
        }
      }

      if (this.name == true && this.excellKeyValid == true) {
        this.loader.presentLoader();

        this.imeiIssues = [];
        this.willDownload = true;
        let url = ServerUrl.live + '/esim/uploadSimDetails';
        this.ajaxService
          .ajaxPostWithBody(url, this.dataString)
          .subscribe((res) => {
            this.loader.dismissLoader();
            if (res.message == 'Saved successfully') {
              this.messageService.add({
                key: 'toast1',
                severity: 'success',
                summary: 'Success',
                detail: res.message,
              });
              this.file = undefined;
            } else {
              this.messageService.add({
                key: 'toast1',
                severity: 'warn',
                summary: 'Warning',
                detail: 'Upload Faild',
              });
            }
          });
      }
    }
  }
  clear() {
    this.file = undefined;
  }
  downloadExcel() {
    const link = document.createElement('a');
    link.href =
      'https://kingstrackimages.s3.ap-southeast-1.amazonaws.com/EsimExcelDowmload/TechnojacksEsimDetails.xlsx';
    link.download = 'sample.xlsx';
    link.click();
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
      title: 'Esim Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }

  getGridData() {
    this.loader.presentLoader();
    if (this.activeTab.label == 'Un-Assigned') {
      this.pagename = 'unassigned';
    } else {
      this.pagename = 'assigned';
    }
    var url =
      ServerUrl.live +
      '/esim/getSimDetails?data=' +
      this.pagename +
      '&page=' +
      this.gridPagination.currentPage;
    if (this.gridPagination.isSearched) {
      url = url + "&Search=" + this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      let countUrl = '/esim/getCountSimDetails?data=' + this.pagename;
      if (this.gridPagination.isSearched) {
        countUrl = countUrl + "&Search=" + this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      this.loader.dismissLoader();
    });
  }

  ngOnInit() {
    this.activeTab = this.tabs[0];
    this.getGridData();
  }

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData();
  }
}
