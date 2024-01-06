import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
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
  selector: 'app-role-management',

  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '800ms ease',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        ),
      ]),
    ]),
  ],
})
export class RoleManagementComponent {
  pagePermission: any;
  loginData: any = [];
  pageselector = true;
  pageselector1 = false;
  rowData = [];
  columnDefs: any;
  menuVisible: boolean = false;
  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };

  selectedRowSize: number;
  endis = false;
  roleName = '';
  filtered: any;
  roleId: any;
  gridApi: any;
  superroleid: any;
  constructor(
    private ajaxService: AjaxService,
    private messageService: MessageService,
    private loader: LoaderService,
    private permission: PermissionService,
    private gridService: AgGridService
  ) {}
  color = { value: true };
  getRolesData() {
    let loginData = JSON.parse(localStorage.getItem('loginData'));
    let url =
      ServerUrl.live + `/esim/getRolesToCreate?roleId=` + loginData?.roleid;
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      localStorage.setItem('permissions', JSON.stringify(res));
      this.loginData = JSON.parse(localStorage['permissions']);
    });
  }

  toggleActivate(event) {
    this.loader.presentLoader();
    console.log(event.data.roleid);
    let url = ServerUrl.live + '/esim/deleteRole?roleId=' + event.data.roleid;
    this.ajaxService.ajaxdelete(url).subscribe((res) => {
      if (
        res.message == 'Role activated successfully' ||
        res.message == 'Role deactivated successfully'
      ) {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.getGridData();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: 'There was some error',
        });
      }
    });
    this.loader.dismissLoader();
  }

  changeMenu(d) {
    if (d == 1) {
      this.pageselector1 = false;
      this.pageselector = true;
      this.endis = false;
      this.cellrow = {};
      this.getGridData();
    } else {
      this.loginData = JSON.parse(localStorage['permissions']);
      this.roleName = '';
      this.endis = false;
      this.cellrow = {};
      this.pageselector1 = true;
      this.pageselector = false;
    }
  }
  cellrow: any = {};
  edit(d) {
    this.pageselector1 = true;
    this.pageselector = false;
    this.endis = true;
    this.cellrow = d;
    this.roleName = d.data.rolename;
    this.roleId = d.data.roleid;
    let url =
      ServerUrl.live +
      '/esim/getRolesToEdit?subRoleId=' +
      d.data.roleid +
      '&superRoleId=' +
      this.superroleid.roleid;
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.loginData = res;
    });
  }

  editData(event) {
    event.target.disabled = true;
    if (this.roleName != '') {
      let url = ServerUrl.live + '/esim/saveRole';
      let body = {
        roleid: this.roleId.toString(),
        userid: JSON.parse(localStorage['loginData'])['primaryemail'],
        rolename: this.roleName,
        menusetting: this.loginData,
      };
      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'Role edited successfully') {
          this.cellrow = {};
          this.roleName = '';
          this.messageService.add({
            key: 'toast1',
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.endis = false;
          this.loginData = JSON.parse(localStorage['permissions']);
        } else {
          this.messageService.add({
            key: 'toast1',
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
        event.target.disabled = false;
      });
    } else {
      this.messageService.add({
        key: 'toast1',
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter the role name ',
      });
    }
  }

  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }
  getGridData() {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/getRoleByCrtdBy?crtdBy=' +
      JSON.parse(localStorage['loginData'])['primaryemail'];
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.loader.dismissLoader();
      setTimeout(() => {
        this.gridService.autoSizeColumns(this.gridApi);
      }, 10);
    });
  }
  save(event) {
    event.target.disabled = true;
    if (this.roleName != '') {
      let url = ServerUrl.live + '/esim/saveRole';
      let body = {
        roleid: '',
        userid: JSON.parse(localStorage['loginData'])['primaryemail'],
        rolename: this.roleName,
        menusetting: this.loginData,
      };
      this.loader.presentLoader();
      this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
        this.loader.dismissLoader();
        if (res.message == 'Role saved successfully') {
          this.roleName = '';
          this.messageService.add({
            key: 'toast1',
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.endis = false;
          this.loginData = JSON.parse(localStorage['permissions']);
        } else {
          this.messageService.add({
            key: 'toast1',
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
        event.target.disabled = false;
      });
    } else {
      this.messageService.add({
        key: 'toast1',
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter the role name ',
      });
      event.target.disabled = false;
    }
  }
  Clear() {
    this.roleName = '';
    this.loginData = JSON.parse(localStorage['permissions']);
    this.endis = false;
  }

  filterTree(data, header) {
    if (Array.isArray(data.values)) {
      data.values.map((d) => {
        this.filterTree(d, header);
      });
    }
    let dataHeader = data.header == undefined ? data.activity : data.header;
    if (dataHeader == header) {
      this.filtered = data;
    } else {
      if (data.values != undefined) this.filterTree(data.values, header);
    }
  }

  enableTree(data) {
    if (Array.isArray(data)) {
      data.map((d) => {
        d.value = true;
        if (Object.hasOwn(d, 'values')) {
          this.enableTree(d.values);
        }
      });
    }
  }

  disableTree(loginData) {
    loginData.values.map((d) => {
      if (!Object.hasOwn(d, 'activity')) {
        this.disableTree(d);
      }
    });
    var isTrue = false;
    for (let data of loginData.values) {
      if (data.value == true) {
        isTrue = true;
        break;
      }
    }
    if (isTrue == false) {
      loginData.value = false;
    }
  }

  disableChild(data) {
    if (Array.isArray(data)) {
      data.map((d) => {
        d.value = false;
        if (Object.hasOwn(d, 'values')) {
          this.disableChild(d.values);
        }
      });
    }
  }

  manageTree(event, index, data, childIndex) {
    let treeData =
      childIndex == undefined ? data.values : data.values[childIndex].values;
    if (event.checked == true) {
      this.enableTree(treeData);
    } else {
      this.filterTree(this.loginData[index], data.header);
      this.disableTree(this.loginData[index]);
      this.disableChild(treeData);
    }
  }

  ngOnInit() {
    let hii = localStorage.getItem('loginData');
    this.superroleid = JSON.parse(hii);
    this.getRolesData();
    this.pagePermission = this.permission.getPermissionDetails('Role Group');
    if (this.pagePermission?.createrolegroup?.value == false) {
      this.pageselector1 = false;
      this.pageselector = true;
    }
    if (this.pagePermission?.searchrolegroup?.value == false) {
      this.pageselector = false;
      this.pageselector1 = true;
    }
    this.columnDefs = [
      // {
      //   headerName: 'S.No',
      //   field: 'roleid',
      //   filter: 'agTextColumnFilter',
      //   width: 220,
      // },
      {
        headerName: 'Role Group',
        field: 'rolename',
        filter: 'agTextColumnFilter',
        width: 300,
      },
      {
        headerName: 'Created Date',
        field: 'createddate',
        filter: 'agTextColumnFilter',
        width: 250,
      },
      {
        headerName: 'Created By',
        field: 'createdby',
        filter: 'agTextColumnFilter',
        width: 300,
      },
      {
        headerName: 'Status',
        field: 'status',
        filter: 'agTextColumnFilter',
        cellRenderer: (params) => {
          return params.value ? 'ACTIVE' : 'INACTIVE';
        },
        width: 140,
      },
    ];

    if (this.pagePermission?.editrolegroup?.value) {
      this.columnDefs.push({
        headerName: '',
        field: '6',
        width: 150,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Edit',
        },
        onCellClicked: this.edit.bind(this),
        sortable: false,
      });
    }
    if (true) {
      this.columnDefs.push({
        headerName: '',
        field: '6',
        width: 210,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: (params) => {
          return { text: params.data.status ? 'Deactivate' : 'Activate' };
        },
        onCellClicked: this.toggleActivate.bind(this),
        sortable: false,
      });
    }
  }
}
