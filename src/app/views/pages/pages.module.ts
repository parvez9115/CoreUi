import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import {
  AlertModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DropdownModule as pgmodel } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ButtonModule as pButton } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    Page404Component,
    Page500Component,
    SetPasswordComponent,
  ],
  imports: [
    CommonModule,
    pButton,
    pgmodel,
    ButtonModule,
    ModalModule,
    ToastModule,
    PagesRoutingModule,
    CardModule,
    AccordionModule,
    ButtonModule,
    AlertModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    GridModule,
    IconModule,
    FormModule,
  ],
})
export class PagesModule { }
