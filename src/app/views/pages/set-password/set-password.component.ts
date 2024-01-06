import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';

const passwordPattern =
  /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,}$/;

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent implements OnDestroy {
  setPassword!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  pagePermission: any;
  userId: string;
  changePassword: any;
  interval: NodeJS.Timeout;
  //public commonService: CommonService
  constructor(
    private formBuilder: FormBuilder,
    private ajaxService: AjaxService,
    private messageService: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    private loader: LoaderService
  ) { }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  showNewPasswordErrors(): boolean {
    const control = this.setPassword.get('password');
    return control?.touched || control?.dirty;
  }

  showConfirmPasswordErrors(): boolean {
    const control = this.setPassword.get('confirmPassword');
    return control?.touched && control?.hasError('passwordMismatch');
  }

  showSpecialCharacterError(): boolean {
    const control = this.setPassword.get('password');
    return control?.hasError('pattern') && !/[^A-Za-z0-9]/.test(control.value);
  }

  showUppercaseError(): boolean {
    const control = this.setPassword.get('password');
    return control?.hasError('pattern') && !/[A-Z]/.test(control.value);
  }

  showLowercaseError(): boolean {
    const control = this.setPassword.get('password');
    return control?.hasError('pattern') && !/[a-z]/.test(control.value);
  }

  showNumberError(): boolean {
    const control = this.setPassword.get('password');
    return control?.hasError('pattern') && !/\d/.test(control.value);
  }

  toggleValidation(op, event) {
    let password = this.setPassword.controls['password'];
    op.dismissable = false;
    this.interval = setInterval(() => {
      if (password.valid || password.value == '') {
        op.hide();
      } else {
        op.show(event);
      }
    }, 100);
  }

  ngOnInit(): void {
    localStorage.clear();
    this.createForm();
    localStorage.clear();
    this.userId = this.route.snapshot.paramMap.get('primarymail');
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

  createForm() {
    this.setPassword = this.formBuilder.group(
      {
        temppassword: ['', [Validators.required]],
        password: [
          '',
          [Validators.required, Validators.pattern(passwordPattern)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.confirmPassword] }
    );
    this.formControls = Object.keys(this.setPassword.controls);
  }

  onSubmit() {
    let url = ServerUrl.live + '/esim/saveEsimChangepassword';
    let body = {
      emailaddress: this.userId,
      oldpassword: this.setPassword.value.temppassword,
      newpassword: this.setPassword.value.password,
      updateddby: this.userId,
    };
    this.loader.presentLoader();
    this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
      this.loader.dismissLoader();
      if (
        res.message ==
        'Your password has been changed successfully. You can now log in with the new password.'
      ) {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message + "you'll be redirected to login",
        });
        setTimeout(() => {
          this.router.navigateByUrl('');
        }, 4000);
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
