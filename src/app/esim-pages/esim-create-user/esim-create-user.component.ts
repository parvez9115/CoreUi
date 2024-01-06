import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { AgGridEvent, ICellRendererParams } from 'ag-grid-community';
import { Server } from 'http';
import { MessageService } from 'primeng/api';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { CountryServiceService } from 'src/app/service/country-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { GridPaginationService } from 'src/app/service/grid-pagination.service';
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
  selector: 'app-esim-create-user',
  templateUrl: './esim-create-user.component.html',
  styleUrls: ['./esim-create-user.component.scss'],
})
export class EsimCreateUserComponent {
  userForm: FormGroup;
  addressform: FormGroup;
  state = [];
  city = [];
  district = [];
  role = [];
  password_type = 'password';
  eye_icon = true;
  password_type_Login: string = 'password';
  eye_icon_login: boolean = true;
  idtype = [];
  public visible = false;
  collapseVisible = false;
  editCompanyModal = false;
  countries = [];
  selectedRowSize: number;
  rowData = [];
  userType = localStorage['usertype'] != 'SuperAdmin';
  endisConfirm: boolean = false;
  columnDefs: any;
  pagePermission: any;
  formAction = 'new';
  gridData: any;
  addressModal: boolean = false;
  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  address: string;
  isAddressEdit: boolean;
  addressId: any;
  addresses: any;
  rowClassRules = {
    'highlight-row':
      'data.usertype == "Superadmin" || data.usertype == "Admin"',
  };
  @ViewChild('myGrid', { static: false }) myGrid: any;
  companyForm: any;
  billingstate: any[];
  shippingstate: any[];
  gridApi: AgGridEvent;
  activerolelist: any;
  visibleLoader: boolean;
  editCompanyLoader: boolean;
  addressModalLoader: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryServiceService,
    private messageService: MessageService,
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private permission: PermissionService,
    private excel: ExportExcelService,
    private gridService: AgGridService,
    public gridPagination: GridPaginationService
  ) {}

  enforceMaxLength(event: any, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }

  minLengthValidator(control: AbstractControl) {
    const primarylength = control.get('primarycontactno');
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
  endisCon: boolean = false;
  edit(e) {
    this.toggleLiveDemo();
    this.endisCon = true;
    this.formAction = 'edit';
    this.gridData = e.data;
    this.state = [];
    this.userForm.patchValue({
      id: e.data.id.toString(),
      password: e.data.password,
      secondarycontactno: e.data.secondarycontactno,
      primaryemail: e.data.primaryemail,
      secondaryemail: e.data.secondaryemail,
      firstname: e.data.firstname,
      lastname: e.data.lastname,
      idtype: e.data.idtype,
      roleid: e.data.roleid,
      idno: e.data.idno,
      primarycontactno: e.data.primarycontactno,
      status: e.data.status == 'ACTIVE' ? true : false,
    });
  }

  editCompany(e) {
    this.companyForm.patchValue({
      id: e.data.id,
      companyname: e.data.companyname,
      password: e.data.password,
      secondarycontactno: e.data.secondarycontactno,
      primaryemail: e.data.primaryemail,
      secondaryemail: e.data.secondaryemail,
      firstname: e.data.firstname,
      lastname: e.data.lastname,
      idtype: e.data.idtype,
      idno: e.data.idno,
      roleid: e.data.roleid,
      primarycontactno: e.data.primarycontactno,
      billingaddress: e.data.address,
      billingcountry: e.data.country,
      billingcity: e.data.district,
      companydisplayname: e.data.companyname,
      status: e.data.status == 'ACTIVE' ? true : false,
    });
    this.toggleEditCompanyModal();
    this.onChangeCountry(null);
    this.companyForm.patchValue({
      billingstate: e.data.state,
    });
  }
  createForm() {
    this.userForm = this.formBuilder.group(
      {
        id: [''],
        password: [''],
        secondarycontactno: [''],
        primaryemail: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        secondaryemail: [
          '',
          [
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        firstname: ['', Validators.required],
        lastname: [''],
        idtype: [''],
        idno: [''],
        primarycontactno: ['', Validators.required],
        status: [true, Validators.required],
        roleid: ['', Validators.required],
      },
      { validators: [this.minLengthValidator] }
    );

    this.companyForm = this.formBuilder.group(
      {
        id: [''],
        companyname: ['', Validators.required],
        password: [''],
        secondarycontactno: [''],
        primaryemail: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        secondaryemail: [
          '',
          [
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        firstname: ['', Validators.required],
        lastname: [''],
        idtype: [''],
        idno: [''],
        roleid: [''],
        primarycontactno: ['', Validators.required],
        billingaddress: [''],
        billingcountry: [''],
        billingstate: [''],
        billingcity: [''],
        companydisplayname: [''],
        status: [true],
      },
      { validators: [this.minLengthValidator] }
    );

    this.addressform = this.formBuilder.group({
      address: [, Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
    });
    this.addressform.controls['state'].disable();
    this.addressform.controls['city'].disable();
  }

  getDropdownData() {
    let countries = [
      'India',
      'Malaysia',
      'Morocco',
      'Singapore',
      'Saudi Arabia',
      'Egypt',
      'Kenya',
    ];
    for (let country of countries) {
      this.countries.push({ name: country });
    }
  }

  getIdType() {
    let url = ServerUrl.live + '/esim/getIdType';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.idtype = res;
    });
  }
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

  getactiverole() {
    this.loader.presentLoader();
    let url =
      ServerUrl.live +
      '/esim/getActiveRoleByCrtdBy?crtdBy=' +
      JSON.parse(localStorage['loginData'])['primaryemail'];
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.activerolelist = res;
    });
  }

  onChangeCountry(event?, type?) {
    if (type == 'country') {
      this.state = [];
      let states = this.countryService.region[this.addressform.value.country];
      for (let state of states) {
        this.state.push({ name: state });
      }
      this.addressform.controls['state'].enable();
      this.onChangeState({}, 'state');
    }
  }

  onChangeState(event, type) {
    if (type == 'state') {
      this.city = [];
      console.log(this.addressform.value.state);
      let state = [];
      this.state.map((data) => {
        state.push(data.name);
      });
      if (state.includes(this.addressform.value.state)) {
        let city = this.countryService.states[this.addressform.value.state];
        for (let cities of city) {
          this.city.push({ name: cities });
        }
        this.addressform.controls['city'].enable();
      }
    }
  }

  onSubmit(type, ev) {
    ev.target.disabled = true;
    var { secondarycontactno, primarycontactno, status, roleid, ...rest } =
      this.userForm.value;

    if (this.userForm.value.primarycontactno?.toString().length < 10) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Enter the 10 digit number',
      });
      //this.hideSerialNo = false;
    } else if (type == 'edit') {
      this.loader.presentLoader();
      const url = ServerUrl.live + '/esim/saveEsimUserNew';
      this.ajaxService
        .ajaxPostWithBody(url, {
          ...rest,
          status: this.userForm.value.status == true ? 'true' : 'false',
          primarycontactno: this.userForm.value.primarycontactno?.toString(),
          secondarycontactno:
            this.userForm.value.secondarycontactno == null
              ? ''
              : this.userForm.value.secondarycontactno.toString(),
          roleid: this.userForm.value.roleid.toString(),
          createdby: localStorage.getItem('userName'),
        })
        .subscribe((res) => {
          ev.target.disabled = false;
          this.loader.dismissLoader();
          if (res.message == 'Esim user edited successfully') {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            // this.modalController.dismiss({
            //   data: "Esim User Saved Successfully",
            // });
            this.toggleLiveDemo();
            this.getGridData();
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
      this.loader.presentLoader();
      const url = ServerUrl.live + '/esim/saveEsimUserNew';
      this.ajaxService
        .ajaxPostWithBody(url, {
          ...rest,
          status: this.userForm.value.status == true ? 'true' : 'false',
          primarycontactno: this.userForm.value.primarycontactno?.toString(),
          secondarycontactno:
            this.userForm.value.secondarycontactno == null
              ? ''
              : this.userForm.value.secondarycontactno.toString(),
          roleid: this.userForm.value.roleid.toString(),
          createdby: localStorage.getItem('userName'),
        })
        .subscribe((res) => {
          ev.target.disabled = false;
          this.loader.dismissLoader();
          if (res.message == 'Esim user created successfully') {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            // this.modalController.dismiss({
            //   data: "Esim User Saved Successfully",
            // });
            this.toggleLiveDemo();
            this.getGridData();
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

  onCompanySubmit(event) {
    event.target.disabled = true;
    var {
      secondarycontactno,
      primarycontactno,
      status,
      password,
      id,
      roleid,
      ...rest
    } = this.companyForm.value;

    if (this.companyForm.value.primarycontactno?.toString().length < 10) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Enter the 10 digit number',
      });
      event.target.disabled = false;
      //this.hideSerialNo = false;
    } else {
      this.loader.presentLoader();
      const url =
        ServerUrl.live + '/esim/saveEsimAdminNew?isCreatedOutside=false';
      this.ajaxService
        .ajaxPostWithBody(url, {
          ...rest,
          id: this.companyForm.value.id?.toString(),
          roleid: this.companyForm.value.roleid?.toString(),
          primarycontactno: this.companyForm.value.primarycontactno?.toString(),
          secondarycontactno:
            this.companyForm.value.secondarycontactno == null
              ? ''
              : this.companyForm.value.secondarycontactno.toString(),
          status: this.companyForm.value.status == true ? 'true' : 'false',
          password:
            this.companyForm.value.password == null
              ? ''
              : this.companyForm.value.password,
        })
        .subscribe((res) => {
          this.loader.dismissLoader();
          if (res.message == 'Customer edited successfully') {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            this.getGridData();
            this.toggleEditCompanyModal();
            event.target.disabled = false;
          } else {
            this.messageService.add({
              key: 'toast1',
              severity: 'warn',
              summary: 'Warning',
              detail: res.message,
            });
            event.target.disabled = false;
          }
        });
    }
  }

  collapseTab() {
    this.collapseVisible = !this.collapseVisible;
    this.isAddressEdit = false;
    this.addressform.reset();
  }

  getAddress() {
    let url =
      ServerUrl.live +
      '/esim/getShippingAddressByUserId?userId=' +
      localStorage.getItem('userName');
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.addresses = res;
    });
  }

  editAddress(data) {
    this.addressId = data.id;
    this.isAddressEdit = true;
    this.addressform.controls['state'].enable();
    this.addressform.controls['city'].enable();
    console.log(data);
    this.addressform.patchValue({
      address: data.address,
      country: data.country,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
    });
    this.onChangeCountry(data, 'country');
    this.collapseVisible = true;
  }

  saveAddress() {
    let url = ServerUrl.live + '/esim/saveShippingAddress';
    this.loader.presentLoader();
    let body = {
      id: '',
      address: this.addressform.value.address,
      city: this.addressform.value.city,
      state: this.addressform.value.state,
      pincode: this.addressform.value.pincode,
      country: this.addressform.value.country,
      userid: localStorage['userName'],
      createdby: localStorage['userName'],
    };
    if (this.isAddressEdit) {
      body.id = this.addressId.toString();
    }
    this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
      this.loader.dismissLoader();
      if (
        res.message == 'Shipping Address saved successfully' ||
        'Shipping Address updated successfully'
      ) {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.addressform.reset();
        this.collapseVisible = false;
        this.getAddress();
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

  handleConfirm(address) {
    this.addressId = address.id;
    this.toggleConfirm();
  }
  toggleConfirm() {
    this.endisConfirm = !this.endisConfirm;
  }

  delete() {
    const url =
      ServerUrl.live +
      '/esim/deleteShippingAddress?addressId=' +
      this.addressId;
    this.ajaxService.ajaxdelete(url).subscribe((res) => {
      if (res.message == 'Shipping address deleted successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.getAddress();
        this.toggleConfirm();
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

  toggleModal(d?) {
    if (d == true) {
      this.addressform.reset();
    }
    if (!this.addressModal) {
      this.addressModalLoader = !this.addressModal;
      this.collapseVisible = false;
      setTimeout(() => (this.addressModal = !this.addressModal), 200);
    } else {
      this.addressModal = !this.addressModal;
      this.collapseVisible = false;
    }

    if (!this.addressModal) {
      this.isAddressEdit = false;
    }
  }

  handleAddressModalChange(event: any) {
    this.addressModal = event;
  }

  toggleLiveDemo() {
    this.endisCon = false;
    if (!this.visible) {
      this.visibleLoader = !this.visible;
      setTimeout(() => (this.visible = !this.visible), 200);
    } else {
      this.visible = !this.visible;
    }
    this.clear();
    this.createForm();
  }

  toggleEditCompanyModal() {
    if (!this.editCompanyModal) {
      this.editCompanyLoader = !this.editCompanyModal;
      setTimeout(() => (this.editCompanyModal = !this.editCompanyModal), 200);
    } else {
      this.editCompanyModal = !this.editCompanyModal;
    }
    if (!this.editCompanyModal) this.clearForm();
  }
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  handleEditCompanyModal(event) {
    this.editCompanyModal = event;
  }

  endisConfirmModal(event) {
    this.endisConfirm = event;
  }

  showHidePass() {
    this.password_type = this.password_type == 'text' ? 'password' : 'text';
    this.eye_icon = !this.eye_icon;
  }
  showHidePassLogin() {
    this.password_type_Login =
      this.password_type_Login == 'text' ? 'password' : 'text';
    this.eye_icon_login = !this.eye_icon_login;
  }

  onCancel() {
    this.clear();
    this.toggleLiveDemo();
  }

  clear() {
    this.userForm.reset();
    this.formAction = 'new';
  }

  clearCompanyForm() {
    this.clearForm();
    this.toggleEditCompanyModal();
  }

  clearForm() {
    this.companyForm.reset();
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

  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }

  getGridData() {
    this.loader.presentLoader();
    var url =
      ServerUrl.live +
      '/esim/getAllUserByCreatedBy?userId=' +
      localStorage['userName'] +
      '&page=' +
      this.gridPagination.currentPage;

    if (this.gridPagination.isSearched) {
      url = url + '&Search=' + this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      var countUrl =
        '/esim/getAllCountUserByCreatedBy?userId=' + localStorage['userName'];

      if (this.gridPagination.isSearched) {
        countUrl = countUrl + '?Search=' + this.gridPagination.searchTerm;
      }
      this.gridPagination.getTotalRecords(countUrl);
      this.loader.dismissLoader();
      setTimeout(() => {
        this.gridService.autoSizeColumns(this.gridApi);
      }, 0);
    });
  }

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData();
  }

  ngOnInit(): void {
    this.getGridData();
    this.getRole();
    this.getactiverole();
    this.getIdType();
    this.getDropdownData();
    this.createForm();
    this.getAddress();
    this.pagePermission = this.permission.getPermissionDetails('Esim User');
    this.columnDefs = [
      {
        headerName: 'Primary Email',
        field: 'primaryemail',
        filter: 'agTextColumnFilter',
        width: 180,
      },
      {
        headerName: 'First Name',
        field: 'firstname',
        filter: 'agTextColumnFilter',
        width: 140,
      },
      {
        headerName: 'Last Name',
        field: 'lastname',
        filter: 'agTextColumnFilter',
        width: 140,
      },
      {
        headerName: 'Primary Contact No',
        field: 'primarycontactno',
        filter: 'agTextColumnFilter',
        width: 180,
      },
      {
        headerName: 'Status',
        field: 'status',
        filter: 'agTextColumnFilter',
        width: 100,
      },
      {
        headerName: 'Created By',
        field: 'createdby',
        filter: 'agTextColumnFilter',
        width: 180,
      },
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
        onCellClicked: (params) => {
          if (
            params.data.usertype == 'Superadmin' ||
            params.data.usertype == 'Admin'
          ) {
            this.editCompany(params);
          } else {
            this.edit(params);
          }
        },
        sortable: false,
      });
    }
  }
}
