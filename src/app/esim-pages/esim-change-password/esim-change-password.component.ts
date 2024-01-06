import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ServerUrl } from '../../../environment';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/service/permission.service';
import { AuthguardService } from 'src/app/service/authguard.service';

const passwordPattern =
  /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,}$/;

@Component({
  selector: 'app-esim-change-password',
  templateUrl: './esim-change-password.component.html',
  styleUrls: ['./esim-change-password.component.scss'],
})
export class EsimChangePasswordComponent implements OnDestroy {
  changePassword!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  pagePermission: any;
  interval: NodeJS.Timeout;
  //public commonService: CommonService
  constructor(
    private formBuilder: FormBuilder,
    private ajaxService: AjaxService,
    private messageService: MessageService,
    private authService: AuthguardService,
    private permission: PermissionService,
    public router: Router
  ) {}
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  confirmPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    if (password?.valid && password?.value === confirm?.value) {
      confirm?.setErrors(null);
      return null;
    }
    confirm?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  // createForm() {
  //   this.changePassword = this.formBuilder.group(
  //     {
  //       oldpassword: ['', [Validators.required]],
  //       password: ['', [Validators.required]],
  //       confirmPassword: ['', [Validators.required]],
  //     },
  //     { validators: [this.confirmPassword] }
  //   );
  //   this.formControls = Object.keys(this.changePassword.controls);
  // }

  createForm() {
    this.changePassword = this.formBuilder.group(
      {
        oldpassword: ['', [Validators.required]],
        password: [
          '',
          [Validators.required, Validators.pattern(passwordPattern)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.confirmPassword] }
    );
    this.formControls = Object.keys(this.changePassword.controls);
  }

  showNewPasswordErrors(): boolean {
    const control = this.changePassword.get('password');
    return control?.touched || control?.dirty;
  }

  showConfirmPasswordErrors(): boolean {
    const control = this.changePassword.get('confirmPassword');
    return control?.touched && control?.hasError('passwordMismatch');
  }

  showSpecialCharacterError(): boolean {
    const control = this.changePassword.get('password');
    return control?.hasError('pattern') && !/[^A-Za-z0-9]/.test(control.value);
  }

  showUppercaseError(): boolean {
    const control = this.changePassword.get('password');
    return control?.hasError('pattern') && !/[A-Z]/.test(control.value);
  }

  showLowercaseError(): boolean {
    const control = this.changePassword.get('password');
    return control?.hasError('pattern') && !/[a-z]/.test(control.value);
  }

  showNumberError(): boolean {
    const control = this.changePassword.get('password');
    return control?.hasError('pattern') && !/\d/.test(control.value);
  }

  toggleValidation(op, event) {
    let password = this.changePassword.controls['password'];
    op.dismissable = false;
    this.interval = setInterval(() => {
      if (password.valid || password.value == '') {
        op.hide();
      } else {
        op.show(event);
      }
    }, 100);
  }

  onSubmit() {
    let url = ServerUrl.live + '/esim/saveEsimChangepassword';
    let body = {
      emailaddress: localStorage.getItem('userName'),
      oldpassword: this.changePassword.value.oldpassword,
      newpassword: this.changePassword.value.password,
      updateddby: localStorage.getItem('userName'),
    };
    this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
      if (res.message == 'Your password has been changed successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message + ", You'll be redirected to Login",
        });
        this.changePassword.reset();
        localStorage.clear();
        setTimeout(() => {
          localStorage.clear();
          this.authService.setMenu([]);
          this.router.navigateByUrl('/login');
        }, 3000);
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

  ngOnInit(): void {
    this.createForm();
    this.pagePermission = this.permission.getPermissionDetails(
      'Esim Change Password'
    );
  }
}
