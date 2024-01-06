import {
  AfterViewInit,
  Component,
  ElementRef,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { TabMenu } from 'primeng/tabmenu';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { GridPaginationService } from 'src/app/service/grid-pagination.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-esim-topup-request',
  templateUrl: './esim-topup-request.component.html',
  styleUrls: ['./esim-topup-request.component.scss'],
})
export class EsimTopupRequestComponent implements OnInit, AfterViewInit {
  rowData: any;
  columnDefs: any = [
    {
      headerName: 'Topup Request ID',
      field: 'topuprequestid',
      width: 200,
      filter: 'agTextColumnFilter',
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
      headerName: 'Topup Request Date',
      field: 'topuprequestdate',
      width: 200,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 180,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested By',
      field: 'stockowner',
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
    {
      headerName: 'Comment',
      field: 'comment',
      width: 150,
      filter: 'agTextColumnFilter',
    },
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
  };
  selectedRowSize = 100;
  gridApi: AgGridAngular;
  selectedRows: any;
  topupModalToggle: boolean = false;
  topupForm: FormGroup;
  plans = [
    {
      planValue: '1Month',
      years: '1 Month',
    },
    {
      planValue: '2Month',
      years: '2 Month',
    },
    {
      planValue: '3Month',
      years: '3 Month',
    },
    {
      planValue: '4Month',
      years: '4 Month',
    },
    {
      planValue: '5Month',
      years: '5 Month',
    },
    {
      planValue: '6Month',
      years: '6 Month',
    },
    {
      planValue: '7Month',
      years: '7 Month',
    },
    {
      planValue: '8Month',
      years: '8 Month',
    },
    {
      planValue: '9Month',
      years: '9 Month',
    },
    {
      planValue: '10Month',
      years: '10 Month',
    },
    {
      planValue: '11Month',
      years: '11 Month',
    },
  ];
  tabs: any = [{ label: 'Pending' }, { label: 'Topped Up' }];
  activeTab: any = {};
  @ViewChild('topup', { static: false }) topupButton: ElementRef;
  gridData: any;
  pagePermissions: any;
  @ViewChild('ETGrid', { static: false }) myGrid: any;
  @ViewChild('tabMenu', { static: false }) tabMenu: TabMenu;
  columnApi: any;
  currenttab: 'Pending';
  usertype: any;
  topupModalLoader: boolean;
  firstAttempt: boolean;
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private permission: PermissionService,
    private excel: ExportExcelService,
    private gridService: AgGridService,
    public gridPagination: GridPaginationService
  ) {}
  ngAfterViewInit(): void {
    this.getGridData();
  }

  selectedRowColumnDefs: any[] = [
    {
      headerName: 'Topup Request ID',
      field: 'topuprequestid',
      width: 230,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Primary ICCID No',
      field: 'primaryiccidno',
      width: 300,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested Company',
      field: 'requestedcompany',
      width: 230,
      filter: 'agTextColumnFilter',
    },
  ];

  tabChanged(event) {
    this.currenttab = event.label;
    let url =
      ServerUrl.live +
      '/esim/getAllTopupRequest?companyId=' +
      localStorage.getItem('userName')+"&data="+(this.currenttab == 'Pending'?'inactive':'active')+"&page="+this.gridPagination.currentPage;
      if(this.gridPagination.isSearched){
        url=url+"&Search="+this.gridPagination.searchTerm;
      }
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.gridData = res;
      this.rowData=this.gridData;
      let countUrl="/esim/getAllCountTopupRequest?companyId="+localStorage.getItem('userName')+"&data="+(this.currenttab == 'Pending'?'inactive':'active');
      if(this.gridPagination.isSearched){
        countUrl=countUrl+"&Search="+this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      if (this.currenttab == 'Pending') {
        if (this.usertype == 'SuperAdmin') {
          this.columnDefs = [
            {
              headerName: 'Topup Request ID',
              field: 'topuprequestid',
              width: 200,
              filter: 'agTextColumnFilter',
              checkboxSelection: true,
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
              headerName: 'Topup Request Date',
              field: 'topuprequestdate',
              width: 200,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Requested Company',
              field: 'requestedcompany',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Requested By',
              field: 'stockowner',
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
            {
              headerName: 'Comment',
              field: 'comment',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Status Updated Date',
              field: 'statusupdateddate',
              width: 180,
              filter: 'agTextColumnFilter',
            },
          ];
        } else {
          this.columnDefs = [
            {
              headerName: 'Topup Request ID',
              field: 'topuprequestid',
              width: 200,
              filter: 'agTextColumnFilter',
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
              headerName: 'Topup Request Date',
              field: 'topuprequestdate',
              width: 200,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Requested Company',
              field: 'requestedcompany',
              width: 180,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Requested By',
              field: 'stockowner',
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
            {
              headerName: 'Comment',
              field: 'comment',
              width: 150,
              filter: 'agTextColumnFilter',
            },
            {
              headerName: 'Status Updated Date',
              field: 'statusupdateddate',
              width: 180,
              filter: 'agTextColumnFilter',
            },
          ];
        }
      } else {
        this.columnDefs = [
          {
            headerName: 'Topup Request ID',
            field: 'topuprequestid',
            width: 200,
            filter: 'agTextColumnFilter',
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
            headerName: 'Topup Request Date',
            field: 'topuprequestdate',
            width: 200,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Requested Company',
            field: 'requestedcompany',
            width: 180,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Requested By',
            field: 'stockowner',
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
          {
            headerName: 'Comment',
            field: 'comment',
            width: 150,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Status Updated Date',
            field: 'statusupdateddate',
            width: 180,
            filter: 'agTextColumnFilter',
          },
        ];
      }
      if (event.label == 'Topped Up') {
        this.pagePermissions.topup.value
          ? (this.topupButton.nativeElement.style.display = 'none')
          : null;
        // this.filterGrid('');
      } else if (event.label == 'Pending') {
        this.pagePermissions.topup.value
          ? (this.topupButton.nativeElement.style.display = 'block')
          : null;
        // this.filterGrid(null);
      }
    });
  }
  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData();
  }
  // filterGrid(checkFor) {
  //   if (checkFor != null) {
  //     this.rowData = this.gridData.filter((data) => {
  //       return data.statusupdateddate != null;
  //     });
  //     setTimeout(() => {
  //       this.gridService.autoSizeColumns(this.gridApi);
  //     }, 0);
  //   } else {
  //     this.rowData = this.gridData.filter((data) => {
  //       return data.statusupdateddate == null;
  //     });
  //     setTimeout(() => {
  //       this.gridService.autoSizeColumns(this.gridApi);
  //     }, 0);
  //   }
  // }

  export() {
    let data = this.rowData;
    let coloumnArray = [];

    this.myGrid.columnDefs.map((p) => {
      coloumnArray.push(p.field);
    });

    for (let i = 0; i < data.length; i++) {
      let k = Object.keys(data[i]);
      for (let j = 0; j < k.length; j++) {
        if (
          coloumnArray.includes(k[j]) == false ||
          k[j].includes('stockowner')
        ) {
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
      title: 'Esim Topup Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  createTopupForm() {
    this.topupForm = this.formBuilder.group({
      comment: [''],
    });
  }
  onGridReady(event) {
    this.gridApi = event;
    this.columnApi = event;
  }

  getGridData() {
    this.tabChanged(this.tabMenu.activeItem);
  }

  toggleTopupModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase Order to Topup!!',
      });
      this.topupModalToggle = false;
      return;
    }
    if (!this.topupModalToggle) {
      this.topupModalLoader = !this.topupModalToggle;
      setTimeout(() => this.topupModalToggle = !this.topupModalToggle, 200);
    } else {
      this.topupModalToggle = !this.topupModalToggle;
    }
    this.clear();
  }

  clearToast() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length > 0) {
      this.messageService.clear();
    }
  }

  clear() {
    this.topupForm.reset();
  }

  handleTopupModalChange(event) {
    this.topupModalToggle = event;
    if (!event && (this.firstAttempt==true)){ 
      this.gridApi?.api.deselectAll();
    } 
    this.firstAttempt=true;
    this.clear();
  }

  topupActivation() {
    let requestBody = [];
    this.selectedRows.map((row) => {
      requestBody.push({
        primaryiccidno: row.primaryiccidno,
        topupno: row.topupno.toString(),
        invoiceno: row.invoiceno,
        comment: this.topupForm.controls['comment'].value
          ? this.topupForm.controls['comment'].value
          : '',
        createdby: localStorage.getItem('userName'),
      });
    });
    let url = ServerUrl.live + '/esim/saveTopupStatusUpdate';
    this.loader.presentLoader();
    this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
      if (
        res.message ==
        'The top-up request has been processed successfully, and the top-up has been completed.'
      ) {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.getGridData();
        this.toggleTopupModal();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: res.message,
        });
      }
      this.clear();
      this.loader.dismissLoader();
    });
  }

  ngOnInit() {
    this.pagePermissions =
      this.permission.getPermissionDetails('Topup Request');
    this.usertype = localStorage.getItem('usertype');
    this.createTopupForm();
    this.activeTab = this.tabs[0];
  }
}
