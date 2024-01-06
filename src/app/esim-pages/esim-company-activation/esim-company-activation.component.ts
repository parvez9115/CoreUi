import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
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

      .button:disabled {
        opacity: 0.5;
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
    return true;
  }
}

@Component({
  selector: 'app-esim-company-activation',
  templateUrl: './esim-company-activation.component.html',
  styleUrls: ['./esim-company-activation.component.scss'],
})
export class EsimCompanyActivationComponent {
  selectedRowSize: number;
  rowData = [];
  columnDefs = [];
  pagePermission: any;
  defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };
  detailsModal: boolean = false;
  details: any = {};
  role: any;
  selectedRole;
  activateModalToggle: boolean = false;
  selectedGridData: any;
  constructor(
    private pagePermissions: PermissionService,
    private ajaxService: AjaxService,
    private messageService: MessageService,
    private loader: LoaderService
  ) {}

  getRole() {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/getRoleByCrtdBy?crtdBy=' +
      JSON.parse(localStorage['loginData'])['primaryemail'];
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.role = res;
      this.loader.dismissLoader();
    });
  }

  activateUser() {
    let event = this.selectedGridData;
    event.eventPath[0].disabled = true;
    if (this.selectedRole == undefined || null || '') {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a role for the customer',
      });
      return;
    }
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/activateCustomer?userId=' +
      event.data.primaryemail +
      '&roleId=' +
      this.selectedRole;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      if (res.message == 'Customer activated successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.onGridReady();
        this.toggleActivateModal({});
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: res.message,
        });
      }
    });
  }
  getActivationRequests() {
    this.loader.presentLoader();
    let url = ServerUrl.live + '/esim/getCustomersForActivation';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.rowData = res;
    });
  }
  onGridReady() {}
  handleDetailsModalChange(event: boolean) {
    this.detailsModal = event;
  }
  handleActivateModalChange(event: boolean) {
    this.activateModalToggle = event;
  }
  toggleActivateModal(event) {
    this.activateModalToggle = !this.activateModalToggle;
    this.selectedGridData = event;
  }
  toggleLiveDemo() {
    this.detailsModal = !this.detailsModal;
  }
  viewRequest(data) {
    this.details = data.data;
    this.detailsModal = !this.detailsModal;
  }

  ngOnInit() {
    this.getActivationRequests();
    this.getRole();
    this.pagePermission =
      this.pagePermissions.getPermissionDetails('Company Activation');
    this.columnDefs = [
      {
        headerName: 'Primary Email',
        field: 'primaryemail',
        filter: 'agTextColumnFilter',
        width: 250,
      },
      {
        headerName: 'First name',
        field: 'firstname',
        filter: 'agTextColumnFilter',
        width: 120,
      },
      {
        headerName: 'Company Name',
        field: 'companyname',
        filter: 'agTextColumnFilter',
        width: 180,
      },
      {
        headerName: 'Contact no',
        field: 'primarycontactno',
        filter: 'agTextColumnFilter',
        width: 180,
      },
      {
        headerName: 'Country',
        field: 'country',
        filter: 'agTextColumnFilter',
        width: 120,
      },
      {
        headerName: 'Activate',
        field: '6',
        width: 130,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Activate',
        },
        onCellClicked: this.toggleActivateModal.bind(this),
        sortable: false,
      },
      {
        headerName: 'Request Details',
        field: '7',
        width: 160,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'View Details',
        },
        onCellClicked: this.viewRequest.bind(this),
        sortable: false,
      },
    ];
  }
}
