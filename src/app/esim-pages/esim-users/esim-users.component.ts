import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { GridApi, ICellRendererParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { LoaderService } from 'src/app/service/loader.service';
import { ServerUrl } from 'src/environment';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { PermissionService } from 'src/app/service/permission.service';

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
  selector: 'app-esim-users',
  templateUrl: './esim-users.component.html',
  styleUrls: ['./esim-users.component.scss'],
})
export class EsimUsersComponent implements OnInit, OnDestroy {
  @ViewChild('myGrid', { static: false }) myGrid: any;
  gridApi: GridApi;
  userForm: FormGroup;
  formAction = 'new';
  public visible = false;
  selectedRowSize: number;
  showPassword: any;
  password_type: string = 'password';
  eye_icon = true;
  obj: boolean = false;
  gridData: any;
  ExcelSubscription;
  pagePermission: any;
  rowData = [];
  columnDefs: any;
  idtype = [];
  role: any = [];
  constructor(
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService
  ) {}

  getIdType() {
    let url = ServerUrl.live + '/esim/getIdType';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.idtype = res;
    });
  }

  ngOnDestroy(): void {}

  // ontoggle(Event: Event) {
  //   this.obj = (<HTMLInputElement>Event.target).checked;
  // }

  edit(e) {
    this.toggleLiveDemo();
    this.endisCon = true;
    this.formAction = 'edit';
    this.gridData = e.data;

    let d = e.data.status == 'ACTIVE' ? true : false;
    this.userForm.patchValue({
      username: e.data.emailaddress,
      password: e.data.password,
      primaryemail: e.data.primaryemail,
      secondaryemail: e.data.secondaryemail,
      lastname: e.data.lastname,
      firstname: e.data.firstname,
      contactno: e.data.primarycontactno,
      secondarycontactno: e.data.secondarycontactno,
      roleid: e.data.roleid,
      idtype: e.data.idtype,
      idno: e.data.idno,
      status: d,
    });
  }

  minLengthValidator(control: AbstractControl) {
    const primarylength = control.get('contactno');
    const secondarylength = control.get('secondarycontactno');
    if (primarylength.value != undefined && primarylength.value != null) {
      if (
        primarylength?.valid &&
        primarylength?.value?.toString().length >= 10
      ) {
        primarylength?.setErrors(null);
      } else {
        primarylength?.setErrors({ minlength: true });
      }
    }

    if (secondarylength.value != undefined && secondarylength.value != null) {
      if (
        secondarylength?.valid &&
        (secondarylength?.value?.toString().length >= 10 ||
          secondarylength?.value?.toString().length == 0)
      ) {
        secondarylength?.setErrors(null);
      } else {
        secondarylength?.setErrors({ minlength: true });
      }
    }
  }

  createForm() {
    this.userForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        primaryemail: ['', [Validators.required, Validators.email]],
        secondaryemail: ['', Validators.email],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        contactno: ['', Validators.required],
        secondarycontactno: [''],
        status: [true, Validators.required],
        roleid: ['', Validators.required],
        idtype: ['', Validators.required],
        idno: ['', Validators.required],
      },
      { validators: [this.minLengthValidator] }
    );
  }
  endisCon = false;
  toggleLiveDemo() {
    this.endisCon = false;
    this.visible = !this.visible;
    this.clear();
    this.createForm();
  }
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  showHidePass() {
    this.password_type = this.password_type == 'text' ? 'password' : 'text';
    this.eye_icon = !this.eye_icon;
  }

  onSubmit(type) {
    if (this.userForm.value.contactno.toString().length != 10) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Enter the 10 Digit Number',
      });
      //this.hideSerialNo = false;
    } else if (type == 'edit') {
      var data;
      data = {
        id: this.gridData.id.toString(),
        primaryemail: this.userForm.value.primaryemail.toString(),
        password: this.userForm.value.password,
        secondaryemail: this.userForm.value.secondaryemail,
        secondarycontactno:
          this.userForm.value.secondarycontactno == null
            ? ''
            : this.userForm.value.secondarycontactno.toString(),
        firstname: this.userForm.value.firstname.toString(),
        lastname: this.userForm.value.lastname.toString(),
        primarycontactno: this.userForm.value.contactno?.toString(),
        status: this.userForm.value.status.toString(),

        idno: this.userForm.value.idno,
        idtype: this.userForm.value.idtype,
        roleid: this.userForm.value.roleid.toString(),
        createdby: localStorage.getItem('userName'),
      };
      const url = ServerUrl.live + '/esim/saveEsimUserNew';
      this.ajaxService
        .ajaxPostWithBody(url, JSON.stringify(data))
        .subscribe((res) => {
          if (res.message == 'Esim user edited successfully') {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            this.toggleLiveDemo();
            this.onGridReady();
          } else {
            this.messageService.add({
              key: 'toast1',
              severity: 'warn',
              summary: 'Warning',
              detail: res.message,
            });
          }
        });
    } else {
      var data;
      data = {
        id: '',
        primaryemail: this.userForm.value.primaryemail.toString(),
        password: this.userForm.value.password,
        firstname: this.userForm.value.firstname.toString(),
        lastname: this.userForm.value.lastname.toString(),
        primarycontactno: this.userForm.value.contactno?.toString(),
        status: this.userForm.value.status.toString(),
        secondaryemail: this.userForm.value.secondaryemail,
        secondarycontactno:
          this.userForm.value.secondarycontactno == null
            ? ''
            : this.userForm.value.secondarycontactno.toString(),
        idno: this.userForm.value.idno,
        idtype: this.userForm.value.idtype,
        roleid: this.userForm.value.roleid.toString(),
        createdby: localStorage.getItem('userName'),
      };
      const url = ServerUrl.live + '/esim/saveEsimUserNew';
      this.ajaxService
        .ajaxPostWithBody(url, JSON.stringify(data))
        .subscribe((res) => {
          if (res.message == 'Esim user saved successfully') {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            this.onGridReady();
            // this.modalController.dismiss({
            //   data: "Esim User Saved Successfully",
            // });
            this.toggleLiveDemo();
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
  }
  getRole() {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/getRoleGroupByUserId?userId=' +
      JSON.parse(localStorage['loginData'])['primaryemail'];
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.role = res;
      this.loader.dismissLoader();
    });
  }
  onCancel() {
    this.clear();
    this.toggleLiveDemo();
  }

  clear() {
    this.userForm.reset();
    this.formAction = 'new';
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
      title: 'Esim User',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };

  onGridReady() {
    this.loader.presentLoader();
    var url =
      ServerUrl.live +
      '/esim/getAllUserByCreatedBy?userId=' +
      localStorage['userName'];
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      this.loader.dismissLoader();
    });
  }

  ngOnInit(): void {
    this.getIdType();
    this.createForm();
    this.getRole();
    this.pagePermission = this.permission.getPermissionDetails('Esim User');
    this.columnDefs = [
      {
        headerName: 'User Name',
        field: 'primaryemail',
        filter: 'agTextColumnFilter',
        width: 180,
      },
      { field: 'firstname', filter: 'agTextColumnFilter', width: 180 },
      { field: 'lastname', filter: 'agTextColumnFilter', width: 180 },
      { field: 'primarycontactno', filter: 'agTextColumnFilter', width: 180 },
      { field: 'status', filter: 'agTextColumnFilter', width: 180 },
      { field: 'createdby', filter: 'agTextColumnFilter', width: 180 },
    ];

    if (this.pagePermission?.edit?.value) {
      this.columnDefs.push({
        headerName: '',
        field: '6',
        width: 100,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Edit',
        },
        onCellClicked: this.edit.bind(this),
        sortable: false,
      });
    }
  }
}
