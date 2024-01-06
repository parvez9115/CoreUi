import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { navItems } from '../../../containers/default-layout/_nav';
import { AjaxService } from '../../../service/ajax-service.service';
import { Router } from '@angular/router';
import { ServerUrl } from '../../../../environment';
import { PermissionService } from 'src/app/service/permission.service';
import { MessageService } from 'primeng/api';
import { CountryServiceService } from '../../../service/country-service.service';
import { LoaderService } from 'src/app/service/loader.service';
import { AuthguardService } from 'src/app/service/authguard.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  password_type_Login: string = 'password';
  eye_icon_login: boolean = true;
  initPage: any;
  loginForm!: FormGroup;
  countries = [];
  Toastvisible: boolean = false;
  dismissible: boolean = true;
  warningData = '';
  idtype = [];
  filteredUrl = [];
  district = [];
  userForm: FormGroup;
  billingstate = [];
  shippingstate = [];
  public visible = false;
  password_type: string = 'password';
  eye_icon = true;
  data: {};
  @ViewChild('liveDemoModal') modal: any;

  constructor(
    private fb: FormBuilder,
    private ajaxService: AjaxService,
    public router: Router,
    public permission: PermissionService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loader: LoaderService,
    private countryService: CountryServiceService,
    private authService: AuthguardService
  ) {}

  getIdType() {
    let url = ServerUrl.live + '/esim/getIdType';
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.idtype = res;
    });
  }

  presentToast(data: any) {
    this.Toastvisible = true;
    this.warningData = data;
    setTimeout(() => {
      this.Toastvisible = false;
    }, 3000);
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
  // login() {
  //   let url =
  //     ServerUrl.live +
  //     `/esim/getLoginEsimUser?emailaddress=${this.loginForm.value.username}&password=${this.loginForm.value.password}`;
  //   this.ajaxService.ajaxget(url).subscribe((res) => {
  //     if (res.message == 'Invalid username or assword') {
  //       this.presentToast('Invalid username or password');
  //     } else if (
  //       res.message == 'This User is Deactivated, Please Contact Admin'
  //     ) {
  //       this.presentToast(res.message);
  //     } else {
  //       localStorage.setItem('loginData', JSON.stringify(res));
  //       localStorage.setItem('userName', this.loginForm.value.username);
  //       localStorage.setItem('userPermission', res.mainmenu);
  //       let filteredUrl: any = navItems.filter((d) => d.name == res.intialmenu);
  //       localStorage.setItem('initPage', filteredUrl[0].url);
  //       if (localStorage['loginData']) {
  //         this.router.navigateByUrl(filteredUrl[0].url);
  //       }
  //     }
  //   });
  // }
  // login() {
  //   let url =
  //     ServerUrl.live +
  //     `/esim/getLoginEsimUser?emailaddress=${this.loginForm.value.username}&password=${this.loginForm.value.password}`;
  //   this.loader.presentLoader();
  //   this.ajaxService.ajaxget(url).subscribe((res) => {
  //     this.loader.dismissLoader();
  //     if (res.message == 'Invalid username or password') {
  //       this.presentToast(res.message);
  //     } else if (
  //       res.message == 'This User is Deactivated, Please Contact Admin'
  //     ) {
  //       this.presentToast(res.message);
  //     } else {
  //       localStorage.setItem('loginData', JSON.stringify(res));
  //       localStorage.setItem('userName', this.loginForm.value.username);
  //       localStorage.setItem('userPermission', res.mainmenu);
  //       localStorage.setItem('zohoInvoice', res.zohoInvoice);
  //       localStorage.setItem('usertype', res.usertype);
  //       this.setInitPage(JSON.parse(res.mainmenu));
  //       navItems.forEach((d) => {
  //         if (d['children']) {
  //           this.recursive(d);
  //         } else {
  //           this.filteredUrl.push(d);
  //         }
  //       });
  //       let url = this.filteredUrl.filter(
  //         (m) => m.name == this.initPage.header
  //       );
  //       localStorage.setItem('initPage', url[0].url);
  //       localStorage['currentPage'] = JSON.stringify({
  //         currentPage: url[0].url,
  //       });
  //       if (localStorage['loginData']) {
  //         this.router.navigateByUrl(url[0].url);
  //       }
  //     }
  //   });
  // }
  login() {
    let username = this.loginForm.value.username;
    let password = encodeURIComponent(this.loginForm.value.password); // Encoding the password

    let url =
      ServerUrl.live +
      `/esim/getLoginEsimUser?emailaddress=${username}&password=${password}`;

    this.loader.presentLoader();

    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      if (res.message == 'Invalid username or password') {
        this.presentToast(res.message);
      } else if (
        res.message == 'This User is Deactivated, Please Contact Admin'
      ) {
        this.presentToast(res.message);
      } else if (
        res.message == 'The role assigned to this login is deactivated.'
      ) {
        this.presentToast(res.message);
      } else {
        localStorage.setItem('loginData', JSON.stringify(res));
        localStorage.setItem('userName', username);
        localStorage.setItem('userPermission', res.mainmenu);
        localStorage.setItem('zohoInvoice', res.zohoInvoice);
        localStorage.setItem('usertype', res.usertype);

        this.setInitPage(JSON.parse(res.mainmenu));

        navItems.forEach((d) => {
          if (d['children']) {
            this.recursive(d);
          } else {
            this.filteredUrl.push(d);
          }
        });

        let url = this.filteredUrl.filter(
          (m) => m.name == this.initPage.header
        );
        localStorage.setItem('initPage', url[0].url);
        localStorage['currentPage'] = JSON.stringify({
          currentPage: url[0].url,
        });

        if (localStorage['loginData']) {
          this.router.navigateByUrl(url[0].url);
        }
      }
    });
  }

  setInitPage(menus) {
    menus.find((menu) => {
      if (menu.value) {
        if (menu.submenu) {
          this.setInitPage(menu.values);
        } else {
          this.initPage = menu;
          return true;
        }
      }
      return false;
    });
  }
  recursive(data) {
    if (data['children']) {
      data.children.map((d) => {
        this.filteredUrl.push(d);
        if (d['children']) {
          this.recursive(d);
        }
      });
    } else {
      this.filteredUrl.push(data);
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

  createForm() {
    this.userForm = this.formBuilder.group(
      {
        id: [''],
        companyname: ['', Validators.required],
        primaryemail: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        primarycontactno: ['', Validators.required],
        password: [''],
        secondarycontactno: [''],
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
      },
      { validators: [this.minLengthValidator] }
    );
    this.userForm.controls['shippingstate'].disable();
    this.userForm.controls['billingstate'].disable();
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

  toggleLiveDemo() {
    this.modal.hostElement.nativeElement.scrollTop = '0';
    this.visible = !this.visible;
    this.clear();
    this.createForm();
  }
  handleLiveDemoChange(event: any) {
    this.modal ? (this.modal.hostElement.nativeElement.scrollTop = '0') : null;
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

  onSubmit(event) {
    this.loader.presentLoader();
    var { secondarycontactno, primarycontactno, ...rest } = this.userForm.value;

    if (this.userForm.value.primarycontactno?.toString().length < 10) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Enter the 10 Digit Number',
      });
      //this.hideSerialNo = false;
    } else {
      const url =
        ServerUrl.live + '/esim/saveEsimAdminNew?isCreatedOutside=true';
      this.ajaxService
        .ajaxPostWithBody(url, {
          ...rest,
          primarycontactno: this.userForm.value.primarycontactno?.toString(),
          secondarycontactno:
            this.userForm.value.secondarycontactno == null
              ? ''
              : this.userForm.value.secondarycontactno.toString(),
          billingstate: this.userForm.value.billingstate
            ? this.userForm.value.billingstate
            : '',
          shippingstate: this.userForm.value.shippingstate
            ? this.userForm.value.shippingstate
            : '',
        })
        .subscribe((res) => {
          this.loader.dismissLoader();
          if (
            res.message ==
            `Your request has been submitted successfully, you'll be contacted by our team shortly.`
          ) {
            this.messageService.add({
              key: 'toast1',
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
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

  onCancel() {
    this.clear();
    this.toggleLiveDemo();
  }

  clear() {
    this.userForm.reset();
  }

  ngOnInit(): void {
    if (localStorage['initPage'] || localStorage.length > 1) {
      this.router.navigateByUrl(localStorage['initPage']);
    }
    this.authService.setMenu([]);
    this.getIdType();
    this.getDropdownData();
    this.createForm();
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
