import { Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
  selector: 'app-esim-extend-validity-request',
  templateUrl: './esim-extend-validity-request.component.html',
  styleUrls: ['./esim-extend-validity-request.component.scss'],
})
export class EsimExtendValidityRequestComponent {
  rowData: any;
  @ViewChild('EEVGrid', { static: false }) myGrid: any;
  columnDefs: any = [
    {
      headerName: 'Extend Request ID',
      field: 'extendrequestid',
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
      headerName: 'Extend Request Date',
      field: 'extendrequestdate',
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
  gridApi: any;
  usertype: any;
  selectedRows: any;
  extendValidityModalToggle: boolean = false;
  extendValidityForm: any;
  plans = [
    {
      planValue: '1 Year',
      years: '1 Year',
    },
    {
      planValue: '2 Year',
      years: '2 Year',
    },
    {
      planValue: '3 Year',
      years: '3 Year',
    },
    {
      planValue: '4 Year',
      years: '4 Year',
    },
  ];
  tabs: any = [{ label: 'Pending' }, { label: 'Extended' }];
  activeTab: any = {};
  @ViewChild('extend', { static: false }) extendButton: ElementRef;
  @ViewChild('tabMenu', { static: false }) tabMenu: any;
  gridData: any;
  pagePermissions: any;
  columnApi: any;
  currenttab: 'Pending';
  extendValidityModalLoader: boolean;
  firstAttempt: boolean;
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private permission: PermissionService,
    private excel: ExportExcelService,
    private gridService: AgGridService,
    public gridPagination:GridPaginationService
  ) {}

  tabChanged(event) {
    this.currenttab = event.label;
    let url =
      ServerUrl.live +
      '/esim/getAllExtendOneYearRequest?companyId=' +
      localStorage.getItem('userName')+"&data="+(this.currenttab == 'Pending'?'inactive':'active')+"&page="+this.gridPagination.currentPage;
      if(this.gridPagination.isSearched){
        url=url+"&Search="+this.gridPagination.searchTerm;
      }
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.gridData = res;
      this.rowData=this.gridData;
      let countUrl="/esim/getAllCountExtendOneYearRequest?companyId="+ localStorage.getItem('userName')+"&data="+(this.currenttab == 'Pending'?'inactive':'active');
      if(this.gridPagination.isSearched){
        countUrl=countUrl+"&Search="+this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      if (this.currenttab == 'Pending') {
        if (this.usertype == 'SuperAdmin') {
          this.columnDefs = [
            {
              headerName: 'Extend Request ID',
              field: 'extendrequestid',
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
              headerName: 'Extend Request Date',
              field: 'extendrequestdate',
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
              headerName: 'Extend Request ID',
              field: 'extendrequestid',
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
              headerName: 'Extend Request Date',
              field: 'extendrequestdate',
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
            headerName: 'Extend Request ID',
            field: 'extendrequestid',
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
            headerName: 'Extend Request Date',
            field: 'extendrequestdate',
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
      if (event.label == 'Extended') {
        this.pagePermissions.extendvalidity.value
          ? (this.extendButton.nativeElement.style.display = 'none')
          : null;
        // this.filterGrid('');
      } else if (event.label == 'Pending') {
        this.pagePermissions.extendvalidity.value
          ? (this.extendButton.nativeElement.style.display = 'block')
          : null;
        // this.filterGrid(null);
      }
    });
  }

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGriddata();
  }

  // filterGrid(checkFor) {
  //   if (checkFor != null) {
  //     this.rowData = this.gridData.filter((data) => {
  //       return data.statusupdateddate != null;
  //     });
  //   } else
  //     this.rowData = this.gridData.filter((data) => {
  //       return data.statusupdateddate == null;
  //     });
  //   setTimeout(() => {
  //     this.gridService.autoSizeColumns(this.gridApi);
  //   }, 0);
  // }

  createExtendValidityForm() {
    this.extendValidityForm = this.formBuilder.group({
      comment: [''],
    });
  }

  onGridReady(event) {
    this.gridApi = event;
    this.getGriddata();
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
      title: 'Esim Extend Validity Details',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  getGriddata() {
    this.tabChanged(this.tabMenu.activeItem);
  }

  toggleExtendValidityModal() {
    this.selectedRows = this.gridApi.api.getSelectedRows();
    if (this.selectedRows.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select a purchase Order to Extend Validity!!',
      });
      this.extendValidityModalToggle = false;
      return;
    }
    if (!this.extendValidityModalToggle) {
      this.extendValidityModalLoader = !this.extendValidityModalToggle;
      setTimeout(() => this.extendValidityModalToggle = !this.extendValidityModalToggle, 200);
    } else {
      this.extendValidityModalToggle = !this.extendValidityModalToggle;
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
    this.extendValidityForm.reset();
  }

  handleExtendValidityModalChange(event) {
    this.extendValidityModalToggle = event;
    if (!event && (this.firstAttempt==true)){ 
      this.gridApi?.api.deselectAll();
    } 
    this.firstAttempt=true;
    this.clear();
  }

  selectedRowColumnDefs: any[] = [
    {
      headerName: 'Extend Request ID',
      field: 'extendrequestid',
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

  extendValidityActivation() {
    let requestBody = [];
    this.selectedRows.map((row) => {
      requestBody.push({
        primaryiccidno: row.primaryiccidno,
        extendno: row.extendno.toString(),
        invoiceno: row.invoiceno,
        // cardactivationdate: activationDate,
        // extendvalidityyear:
        //   this.extendValidityForm.controls['extendValidityPlan'].value,
        comment: this.extendValidityForm.controls['comment'].value
          ? this.extendValidityForm.controls['comment'].value
          : '',
        createdby: localStorage.getItem('userName'),
      });
    });
    let url = ServerUrl.live + '/esim/saveExtendValidityStatusUpdate';
    this.loader.presentLoader();
    this.ajaxService.ajaxPostWithBody(url, requestBody).subscribe((res) => {
      if (
        res.message ==
        'The extend 1 year request has been processed and the validity extended successfully.'
      ) {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.getGriddata();
        this.toggleExtendValidityModal();
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
    this.pagePermissions = this.permission.getPermissionDetails(
      'Extend 1 Year Request'
    );
    this.usertype = localStorage.getItem('usertype');
    this.createExtendValidityForm();
    this.activeTab = this.tabs[0];
  }
}
