import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
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
        width: 50px;
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
  selector: 'app-esim-extend-oneyear-details',
  templateUrl: './esim-extend-oneyear-details.component.html',
  styleUrls: ['./esim-extend-oneyear-details.component.scss'],
})
export class EsimExtendOneyearDetailsComponent {
  selectedRowSize: number;
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService
  ) {}
  pagePermission: any;
  @ViewChild('myGrid', { static: false }) myGrid: any;

  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };
  rowData = [];

  columnDefs: any = [
    {
      headerName: 'ICCID No',
      field: 'iccidno',
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
      filter: 'agTextColumnFilter',
      width: 160,
    },
    {
      headerName: 'Primary Status',
      field: 'primarystatus',
      filter: 'agTextColumnFilter',
      width: 150,
    },
    {
      headerName: 'Fallback ICCID',
      field: 'fallbackiccid',
      filter: 'agTextColumnFilter',
      width: 180,
    },

    {
      headerName: 'Fallback TSP',
      field: 'fallbacktsp',
      filter: 'agTextColumnFilter',
      width: 130,
    },
    {
      headerName: 'Fallback MSISDN',
      field: 'fallbackmsisdn',
      filter: 'agTextColumnFilter',
      width: 160,
    },
    {
      headerName: 'Fallback Status',
      field: 'fallbackstatus',
      filter: 'agTextColumnFilter',
      width: 150,
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
      width: 125,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Activated On',
      field: 'activatedon',
      width: 140,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Expired On',
      field: 'expiredon',
      width: 120,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Extended Validity',
      field: 'extendedvalidity',
      width: 170,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Previous Activated On',
      field: 'previousactivatedon',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Previous Expired On',
      field: 'previousexpiredon',
      width: 190,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Created Date',
      field: 'createddate',
      width: 150,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Created By',
      field: 'createdby',
      filter: 'agTextColumnFilter',
    },
  ];
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
      title: 'Esim Extend 1 Year Activation ',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }
  onGridReady() {
    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/getEsimExtend1YRHistoryDetails';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.loader.dismissLoader();
    });
  }
  ngOnInit() {
    this.pagePermission = this.permission.getPermissionDetails(
      'Esim Extend 1Yr Details'
    );
  }
}
