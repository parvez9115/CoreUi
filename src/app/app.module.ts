import { NgModule } from '@angular/core';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
} from '@coreui/angular';
import { AccordionModule } from 'primeng/accordion';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { HttpClientModule } from '@angular/common/http';
import { EsimActivationPageComponent } from './esim-pages/esim-activation-page/esim-activation-page.component';
import { EsimTopupOneyearActivationComponent } from './esim-pages/esim-topup-oneyear-activation/esim-topup-oneyear-activation.component';
import { EsimTopupDetailsComponent } from './esim-pages/esim-topup-details/esim-topup-details.component';
import { EsimExtendOneyearDetailsComponent } from './esim-pages/esim-extend-oneyear-details/esim-extend-oneyear-details.component';
import { EsimBillingPlanComponent } from './esim-pages/esim-billing-plan/esim-billing-plan.component';
import { EsimAccountMappingComponent } from './esim-pages/esim-account-mapping/esim-account-mapping.component';
import { EsimBillingGenerationComponent } from './esim-pages/esim-billing-generation/esim-billing-generation.component';
import { EsimUsersComponent } from './esim-pages/esim-users/esim-users.component';
import { EsimChangePasswordComponent } from './esim-pages/esim-change-password/esim-change-password.component';
import { EsimModule } from './esim-pages/esim.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoleMenuFilterPipe } from './service/role-menu-filter.pipe';
import { DropdownModule as pgmodel } from 'primeng/dropdown';
import { LoginComponent } from './views/pages/login/login.component';
import { ObjectToArrayPipe } from './service/object-to-array.pipe';
import { StoreModule } from '@ngrx/store';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { invoiceReducer } from './ngRxStore/invoice.Reducer';
import { WebSocketComponent } from './Test/web-socket/web-socket.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
]

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, RoleMenuFilterPipe, WebSocketComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ConfirmDialogModule,
    HttpClientModule,
    AvatarModule,
    ButtonModule,
    HeaderModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    pgmodel,
    EsimModule,
    GridModule,
    ToastModule,
    SidebarModule,
    IconModule,
    PerfectScrollbarModule,
    NavModule,
    ButtonModule,
    FormModule,
    FormsModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    OverlayPanelModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    HttpClientModule,
    AccordionModule,
    StoreModule.forRoot({ invoiceData: invoiceReducer }),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    IconSetService,
    Title,
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
