import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';

@Component({
  selector: 'app-esim-bsnl-certificate',
  templateUrl: './esim-bsnl-certificate.component.html',
  styleUrls: ['./esim-bsnl-certificate.component.scss'],
})
export class EsimBsnlCertificateComponent {
  pagePermissions: any;
  rowData: any;
  @ViewChild('EEVGrid', { static: false }) myGrid: any;
  gridApi: any;
  gridData: any;
  selectedRowSize = 100;
  selectedRows: any;

  constructor(
    private excel: ExportExcelService,
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private messageService: MessageService,
    private permission: PermissionService
  ) {}

  columnDefs: any = [
    {
      headerName: 'Certificate Request ID',
      field: 'certificaterequestid',
      width: 200,
      filter: 'agTextColumnFilter',
      // headerCheckboxSelection: true,
      // checkboxSelection: true,
    },
    {
      headerName: 'Invoice No',
      field: 'invoiceno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID No',
      field: 'primaryiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Fallback ICCID No',
      field: 'fallbackiccidno',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Certificate Request Date',
      field: 'certificateprequestdate',
      width: 230,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 180,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Validity Period',
      field: 'validityperiod',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Card Status',
      field: 'cardstatus',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    // {
    //   headerName: 'Comment',
    //   field: 'comment',
    //   width: 150,
    //   filter: 'agTextColumnFilter',
    // },
    {
      headerName: 'Status Updated Date',
      field: 'statusupdateddate',
      width: 180,
      filter: 'agTextColumnFilter',
    },
  ];

  defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };

  onGridReady(event) {
    this.gridApi = event.api;
    this.loader.presentLoader();
    this.getGriddata();
  }

  getGriddata() {
    let url =
      ServerUrl.live +
      '/esim/getAllBsnlCertificaterequest?companyId=' +
      localStorage.getItem('userName');
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.gridData = res;
    });
  }

  clearToast() {
    this.selectedRows = this.gridApi.getSelectedRows();
    if (this.selectedRows.length > 0) {
      this.messageService.clear();
    }
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
      title: 'Esim BSNL Certificate Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  ngOnInit() {
    this.pagePermissions =
      this.permission.getPermissionDetails('BSNL Certificate');
  }
}
