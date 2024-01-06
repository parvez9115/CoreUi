import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { CountryServiceService } from 'src/app/service/country-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
import { ServerUrl } from 'src/environment';
import { GridPaginationService } from 'src/app/service/grid-pagination.service';

@Component({
  selector: 'colour-cell',
  template: `<button class="button">
    {{ params.text }}
  </button>`,
  styles: [
    `
      .button {
        margin: 10px;
        margin-top: 5px;
        background-color: white;
        color: #3b82f6;
        border-color: transparent;
        line-height: 2;
        border-radius: 5px;
        width: max-content;
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

      .smallButton {
        margin-top: 2px;
        height: 28px;
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
  selector: 'colour-cell',
  template: `<button #button class="button">
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
        box-shadow: none;
      }
      .smallButton {
        margin-top: 2px;
        height: 28px;
      }
    `,
  ],
})
class disableableButtonRenderer
  implements ICellRendererAngularComp, AfterViewInit
{
  ngAfterViewInit(): void {
    this.button.nativeElement.disabled = !(
      !this.params.data.password && !this.params.data.status
    );
  }
  params!: any;
  @ViewChild('button', { static: false }) button: ElementRef;

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
  selector: 'app-esim-company-creation',
  templateUrl: './esim-company-creation.component.html',
  styleUrls: ['./esim-company-creation.component.scss'],
})
export class EsimCompanyCreationComponent {
  userForm: FormGroup;
  state = [];
  district = [];
  role = [];
  password_type = 'password';
  eye_icon = true;
  password_type_Login: string = 'password';
  eye_icon_login: boolean = true;
  idtype = [];
  public visible = false;
  countries = [];
  selectedRowSize: number;
  rowData = [];
  columnDefs: any;
  pagePermission: any;
  formAction = 'new';
  gridData: any;
  shippingstate = [];
  billingstate = [];
  detailsModal: boolean = false;
  details: any = {};
  @ViewChild('liveDemoModal') modal: any;
  @ViewChild('myGrid', { static: false }) myGrid: any;
  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  selectedRole: any;
  selectedGridData: any;
  activateModalToggle: boolean = false;
  gridApi: any;
  canDeactivate: any;
  visibleLoader: boolean = false;
  detailsLoader: boolean = false;
  activateModalLoader: boolean = false;

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
    if (e.colDef.headerName == 'Activation') this.formAction = 'activation';
    else {
      this.formAction = 'edit';
      this.canDeactivate = !(!e.data.password && !e.data.status);
    }
    this.endisCon = true;
    this.gridData = e.data;
    this.state = [];
    this.userForm.controls['shippingcountry'].removeValidators(
      Validators.required
    );
    this.userForm.controls['shippingstate'].removeValidators(
      Validators.required
    );
    this.userForm.controls['shippingaddress'].removeValidators(
      Validators.required
    );
    this.userForm.controls['shippingpincode'].removeValidators(
      Validators.required
    );
    this.userForm.controls['shippingaddress'].removeValidators(
      Validators.required
    );
    this.userForm.patchValue({
      id: e.data.id.toString(),
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
      shippingaddress: '',
      billingcountry: e.data.country,
      shippingcountry: '',
      billingstate: e.data.state,
      shippingstate: '',
      billingcity: e.data.district,
      billingpincode: e.data.pincode,
      shippingcity: '',
      shippingpincode: '',
      companydisplayname: e.data.companydisplayname,
      status: e.data.status,
    });
    if (
      this.userForm.controls['billingcountry'].value != '' &&
      this.userForm.controls['billingcountry'].value != undefined
    ) {
      this.userForm.controls['billingstate'].enable();
      this.onChangeCountry(null, 'billing');
    }
    if (this.userForm.controls['shippingcountry']) {
      this.userForm.controls['shippingstate'].enable();
    }
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
        this.getGridData();
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

  toggleActivateModal(event) {
    if (!this.activateModalToggle) {
      this.activateModalLoader = !this.activateModalToggle;
      setTimeout(
        () => (this.activateModalToggle = !this.activateModalToggle),
        200
      );
    } else {
      this.activateModalToggle = !this.activateModalToggle;
    }
    this.selectedRole = null;
    if (event?.data?.roleid) {
      this.selectedRole = event.data.roleid;
    }
    this.selectedGridData = event;
  }

  handleActivateModalChange(event: boolean) {
    this.activateModalToggle = event;
  }

  handleDetailsModalChange(event: boolean) {
    this.detailsModal = event;
  }

  createForm() {
    this.userForm = this.formBuilder.group(
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
        idtype: ['', Validators.required],
        idno: ['', Validators.required],
        roleid: ['', Validators.required],
        primarycontactno: ['', Validators.required],
        billingaddress: [''],
        shippingaddress: [''],
        billingcountry: [''],
        shippingcountry: [''],
        billingstate: [''],
        shippingstate: [''],
        billingcity: [''],
        billingpincode: [''],
        shippingcity: [''],
        shippingpincode: [''],
        companydisplayname: [''],
        status: [true],
      },
      { validators: [this.minLengthValidator] }
    );
    this.userForm.controls['shippingstate'].disable();
    this.userForm.controls['billingstate'].disable();
  }

  enforceMaxLength(event: any, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
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
      '/esim/getActiveRoleByCrtdBy?crtdBy=' +
      JSON.parse(localStorage['loginData'])['primaryemail'];
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.role = res;
      this.loader.dismissLoader();
    });
  }
  onChangeCountry(event, type) {
    if (type == 'billing') {
      this.billingstate = [];
      let states =
        this.countryService.region[this.userForm.value.billingcountry];
      for (let state of states) {
        this.billingstate.push({ name: state });
      }
      this.userForm.controls['billingstate'].enable();
    } else {
      this.shippingstate = [];
      let states =
        this.countryService.region[this.userForm.value.shippingcountry];
      for (let state of states) {
        this.shippingstate.push({ name: state });
      }
      this.userForm.controls['shippingstate'].enable();
    }
  }
  copyAddress(from) {
    if (from == 'fromshipping') {
      this.userForm.controls['billingstate'].enable();
      this.userForm.patchValue({
        billingcountry: this.userForm.value.shippingcountry,
        billingstate: this.userForm.value.shippingstate,
        billingcity: this.userForm.value.shippingcity,
        billingpincode: this.userForm.value.shippingpincode,
        billingaddress: this.userForm.value.shippingaddress,
      });
    } else {
      this.userForm.patchValue({
        shippingcountry: this.userForm.value.billingcountry,
      });
      this.onChangeCountry('ev', 'shipping');
      this.userForm.patchValue({
        shippingstate: this.userForm.value.billingstate,
        shippingcity: this.userForm.value.billingcity,
        shippingpincode: this.userForm.value.billingpincode,
        shippingaddress: this.userForm.value.billingaddress,
      });
    }
  }
  onSubmit(event) {
    event.target.disabled = true;
    var {
      secondarycontactno,
      primarycontactno,
      status,
      billingstate,
      shippingstate,
      roleid,
      password,
      ...rest
    } = this.userForm.value;

    if (this.userForm.value.primarycontactno?.toString().length < 10) {
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
          primarycontactno: this.userForm.value.primarycontactno?.toString(),
          secondarycontactno:
            this.userForm.value.secondarycontactno == null
              ? ''
              : this.userForm.value.secondarycontactno.toString(),
          status: this.userForm.value.status == true ? 'true' : 'false',
          roleid: this.userForm.value.roleid.toString(),
          password:
            this.userForm.value.password == null
              ? ''
              : this.userForm.value.password,
          billingstate: this.userForm.value?.billingstate
            ? this.userForm.value?.billingstate
            : '',
          shippingstate: this.userForm.value?.shippingstate
            ? this.userForm.value?.shippingstate
            : '',
        })

        .subscribe((res) => {
          this.loader.dismissLoader();
          if (
            res.message == 'Esim customer created successfully' ||
            res.message == 'Customer edited successfully'
          ) {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            this.getGridData();
            this.toggleLiveDemo();
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
  handleLiveDemoChange(event: any) {
    if (event) {
      this.modal
        ? (this.modal.hostElement.nativeElement.scrollTop = '0')
        : null;
    }
    this.visible = event;
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

  viewRequest(data) {
    if (!this.detailsModal) {
      this.detailsLoader = !this.detailsModal;
      setTimeout(() => (this.detailsModal = !this.detailsModal), 200);
    } else {
      this.detailsModal = !this.detailsModal;
    }
    this.details = data.data;
  }

  toggleDetailsModal() {
    this.detailsModal = !this.detailsModal;
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
      title: 'Esim Companies',
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
      '/esim/getAllEsimAdmin?page=' +
      this.gridPagination.currentPage;
    if (this.gridPagination.isSearched) {
      url = url + '&Search=' + this.gridPagination.searchTerm;
    }
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.rowData = res;
      let countUrl = '/esim/getAllCountEsimAdmin';
      if (this.gridPagination.isSearched) {
        countUrl = countUrl + '?Search=' + this.gridPagination.searchTerm;
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
    console.log(document.head);
    this.getGridData();
    this.getRole();
    this.getIdType();
    this.getDropdownData();
    this.createForm();
    this.pagePermission =
      this.permission.getPermissionDetails('Company Creation');
    this.columnDefs = [
      {
        headerName: 'Primary Email',
        field: 'primaryemail',
        filter: 'agTextColumnFilter',
        width: 210,
      },
      {
        headerName: 'First Name',
        field: 'firstname',
        filter: 'agTextColumnFilter',
        width: 150,
      },
      {
        headerName: 'Company Name',
        field: 'companyname',
        filter: 'agTextColumnFilter',
        width: 160,
      },
      {
        headerName: 'Contact No',
        field: 'primarycontactno',
        filter: 'agTextColumnFilter',
        width: 160,
      },
      {
        headerName: 'Status',
        field: 'status',
        filter: 'agTextColumnFilter',
        cellRenderer: (params) => {
          return params.value ? 'ACTIVE' : 'INACTIVE';
        },
        width: 120,
      },
      {
        headerName: 'User Type',
        field: 'usertype',
        filter: 'agTextColumnFilter',
        width: 120,
      },
      {
        headerName: 'Country',
        field: 'country',
        filter: 'agTextColumnFilter',
        width: 140,
      },
    ];
    if (this.pagePermission.edit.value) {
      this.columnDefs.push({
        headerName: 'Edit',
        width: 100,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Edit',
        },
        onCellClicked: this.edit.bind(this),
        sortable: false,
      });
    }

    this.columnDefs.push(
      {
        headerName: 'Activation',
        width: 130,
        cellRenderer: disableableButtonRenderer,
        cellRendererParams: {
          text: 'Activate',
        },

        onCellClicked: (params) => {
          if (!params.data.status) {
            if (
              params.data.password == undefined ||
              params.data.password == ''
            ) {
              this.toggleActivateModal(params);
            }
          }
        },
        sortable: false,
      },
      {
        headerName: 'View Details',
        width: 160,
        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'View Details',
        },
        onCellClicked: this.viewRequest.bind(this),
        sortable: false,
      }
    );
  }
}
