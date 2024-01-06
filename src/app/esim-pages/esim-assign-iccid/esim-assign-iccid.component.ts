import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { SelectionChangedEvent } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { ConnectableObservable } from 'rxjs';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { GridPaginationService } from 'src/app/service/grid-pagination.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-esim-assign-iccid',
  templateUrl: './esim-assign-iccid.component.html',
  styleUrls: ['./esim-assign-iccid.component.scss'],
})
export class EsimAssignICCIDComponent {
  pono: string;
  file: any;
  selectedRowSize: number;
  rowData = [];
  @ViewChild('myGrid', { static: false }) myGrid: any;
  columnDefs: any = [
    {
      headerName: 'Purchase Order No',
      field: 'pono',
      width: 200,
      filter: 'agTextColumnFilter',
      checkboxSelection: true,
    },
    {
      headerName: 'Company Name',
      field: 'companyname',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'PO Date',
      field: 'podate',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Pending Quantity',
      field: 'pendingquantity',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Quantity',
      field: 'totalquantity',
      width: 200,
      filter: 'agTextColumnFilter',
    },
  ];
  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  name: any;
  isFile: boolean;
  dataString: any[];
  isSubmitDisabled: boolean;
  pagePermissions: any;
  @ViewChild('myGrid', { static: false }) Grid: AgGridAngular;
  changeToast: boolean = false;
  gridApi: any;
  rowvalue: any;
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private messageService: MessageService,
    private permission: PermissionService,
    private excel: ExportExcelService,
    private gridService: AgGridService,
    public gridPagination:GridPaginationService
  ) {}

  downloadExcel() {
    const link = document.createElement('a');
    link.href =
      'https://kingstrackimages.s3.ap-southeast-1.amazonaws.com/EsimExcelDowmload/EsimAssignICCID.xlsx';
    link.download = 'sample.xlsx';
    link.click();
  }

  onRowSelected(ev) {
    this.rowvalue = ev.data;

    if (ev.node.isSelected()) {
      if (this.rowvalue.postatus === 'Accepted') {
        if (this.rowvalue.paidstatus === 'Paid') {
          this.pono = this.rowvalue.pono;
        } else {
          this.messageService.add({
            key: 'toast1',
            severity: 'error',
            summary: 'Error',
            detail: 'Payment has not been Accepted',
          });
          this.pono = '';
        }
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: 'PO has not been Accepted',
        });
        this.pono = '';
      }
    }
  }

  onFileChange(ev) {
    var fileName = ev.srcElement.files[0];
    this.name = fileName.name.includes('.xlsx');
    if (this.name == true) {
      this.isFile = true;
      this.dataString = [];
      let workBook = null;
      let jsonData = null;
      let FileName = 'Sheet1';
      const reader = new FileReader();
      const file = ev.srcElement.files[0];
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          FileName = name;
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});

        let json = [];
        for (let i = 0; i < jsonData[FileName].length; i++) {
          let newData = {};
          for (var propt in jsonData[FileName][i]) {
            jsonData[FileName][i][propt] =
              jsonData[FileName][i][propt].toString();
          }
          newData = jsonData[FileName][i];
          newData['createdby'] = localStorage.getItem('userName');
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
    let pendingQuantity = this.rowData.find(
      (data) => this.pono == data.pono
    )?.pendingquantity;
    if (pendingQuantity == undefined) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a valid Purchase Order number',
      });
      return;
    }
    let checkpono = this.rowData.filter((d) => d.pono == this.pono);
    if (checkpono[0].paidstatus == 'Not Paid') {
      this.messageService.add({
        key: 'toast1',
        severity: 'error',
        summary: 'Error',
        detail: 'PO has not been Accepted',
      });

      return;
    }

    if (checkpono[0].paidstatus == 'Not Accept') {
      this.messageService.add({
        key: 'toast1',
        severity: 'error',
        summary: 'Error',
        detail: 'Payment has not been Accepted',
      });

      return;
    }
    if (pendingQuantity < this.dataString.length) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Excel file consists more ICCID numbers than required',
      });
      return;
    }
    this.loader.presentLoader();
    let url =
      ServerUrl.live + '/esim/saveEsimCustomerPurchase?pono=' + this.pono;
    this.ajaxService.ajaxPostWithBody(url, this.dataString).subscribe((res) => {
      this.loader.dismissLoader();
      if (
        res.message.startsWith('Duplicate ICCID found') ||
        res.message.startsWith('ICCID is already assigned')
      ) {
        let message = res.message.replaceAll(',', `\n`);
        res.message = message;
      }
      if (res.message == 'Assigned successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.clear();
        this.getGridData();
      } else {
        let messageBody = {
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: res.message,
        };
        if (
          res.message.startsWith('Duplicate ICCID found') ||
          res.message.startsWith('ICCID is already assigned')
        )
          messageBody['life'] = 6000;
        this.messageService.add(messageBody);
        this.file = undefined;
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
      title: 'Assign ICCID',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  clear() {
    this.file = undefined;
    this.pono = undefined;
    this.Grid.api.deselectAll();
  }
  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }

  getGridData() {
    this.loader.presentLoader();
    let url = ServerUrl.live + '/esim/getPendingPO?page='+this.gridPagination.currentPage;
    if(this.gridPagination.isSearched){
      url=url+"&Search="+this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      var countUrl='/esim/getCountPendingPO';
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

  ngOnInit() {
    this.pagePermissions =
      this.permission.getPermissionDetails('Assign Stocks');
    this.getGridData();
  }
}
