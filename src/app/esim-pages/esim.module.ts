import { EsimRoutingModule } from './esim-routing.module';
import { ElementRef, NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import PrimeNG modules
import { AccordionModule } from 'primeng/accordion';
import {
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  ModalModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  RowComponent,
  SharedModule,
  SpinnerModule,
  NavModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule,
  ToastBodyComponent,
} from '@coreui/angular';
import { TabMenuModule } from 'primeng/tabmenu';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule as pgmodel } from 'primeng/dropdown';
import { EsimActivationPageComponent } from './esim-activation-page/esim-activation-page.component';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { IconModule } from '@coreui/icons-angular';
import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { EsimTopupOneyearActivationComponent } from './esim-topup-oneyear-activation/esim-topup-oneyear-activation.component';
import { EsimTopupDetailsComponent } from './esim-topup-details/esim-topup-details.component';
import { EsimExtendOneyearDetailsComponent } from './esim-extend-oneyear-details/esim-extend-oneyear-details.component';
import { EsimBillingPlanComponent } from './esim-billing-plan/esim-billing-plan.component';
import { EsimAccountMappingComponent } from './esim-account-mapping/esim-account-mapping.component';
import { EsimBillingGenerationComponent } from './esim-billing-generation/esim-billing-generation.component';
import { EsimChangePasswordComponent } from './esim-change-password/esim-change-password.component';
import { EsimUsersComponent } from './esim-users/esim-users.component';
import { SliderModule } from 'primeng/slider';
import { RoleManagementComponent } from './role-management/role-management.component';
import { TreeModule } from 'primeng/tree';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { EsimProductDetailsComponent } from './esim-products/esim-product-details/esim-product-details.component';
import { SimDetailsUploadComponent } from './sim-details-upload/sim-details-upload.component';
import { EsimAdvancePaymentComponent } from './esim-advance-payment/esim-advance-payment.component';
import { EsimInvoiceComponent } from './esim-invoice/esim-invoice.component';
import { EsimCreateUserComponent } from './esim-create-user/esim-create-user.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule as pgButton } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { ObjectToArrayPipe } from '../service/object-to-array.pipe';
import { SalesOrderViewComponent } from './sales-order-view/sales-order-view.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { EsimCompanyCreationComponent } from './esim-company-creation/esim-company-creation.component';
import { EsimCompanyActivationComponent } from './esim-company-activation/esim-company-activation.component';
import { EsimAssignICCIDComponent } from './esim-assign-iccid/esim-assign-iccid.component';
import { EsimPurchaseDetailsComponent } from './esim-purchase-details/esim-purchase-details.component';
import { EsimCaRequestComponent } from './esim-requests/esim-ca-request/esim-ca-request.component';
import { EsimRenewalRequestComponent } from './esim-requests/esim-renewal-request/esim-renewal-request.component';
import { EsimTopupRequestComponent } from './esim-requests/esim-topup-request/esim-topup-request.component';
import { EsimExtendValidityRequestComponent } from './esim-requests/esim-extend-validity-request/esim-extend-validity-request.component';
import { EsimCustomerPriceMappingComponent } from './esim-products/esim-customer-price-mapping/esim-customer-price-mapping.component';
import { EsimRequestDetailsComponent } from './esim-request-details/esim-request-details.component';
import { EsimDashboardComponent } from './esim-dashboard/esim-dashboard.component';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { EsimBsnlCertificateComponent } from './esim-requests/esim-bsnl-certificate/esim-bsnl-certificate.component';
import { PoInvoiceComponent } from './esim-invoice-pages/po-invoice/po-invoice.component';
import { RenewalInvoiceComponent } from './esim-invoice-pages/renewal-invoice/renewal-invoice.component';
import { TopupInvoiceComponent } from './esim-invoice-pages/topup-invoice/topup-invoice.component';
import { ExtendInvoiceComponent } from './esim-invoice-pages/extend-invoice/extend-invoice.component';
import { BsnlInvoiceComponent } from './esim-invoice-pages/bsnl-invoice/bsnl-invoice.component';
import { CaInvoiceComponent } from './esim-invoice-pages/ca-invoice/ca-invoice.component';
@NgModule({
  declarations: [
    ObjectToArrayPipe,
    EsimActivationPageComponent,
    EsimTopupOneyearActivationComponent,
    EsimTopupDetailsComponent,
    EsimExtendOneyearDetailsComponent,
    EsimBillingPlanComponent,
    EsimAccountMappingComponent,
    EsimBillingGenerationComponent,
    EsimChangePasswordComponent,
    EsimUsersComponent,
    RoleManagementComponent,
    EsimProductDetailsComponent,
    SimDetailsUploadComponent,
    EsimAdvancePaymentComponent,
    EsimInvoiceComponent,
    EsimCreateUserComponent,
    SalesOrderComponent,
    SalesOrderViewComponent,
    EsimCompanyCreationComponent,
    EsimCompanyActivationComponent,
    EsimAssignICCIDComponent,
    EsimPurchaseDetailsComponent,
    EsimCaRequestComponent,
    EsimRenewalRequestComponent,
    EsimTopupRequestComponent,
    EsimExtendValidityRequestComponent,
    EsimCustomerPriceMappingComponent,
    EsimRequestDetailsComponent,
    EsimDashboardComponent,
    EsimBsnlCertificateComponent,
    PoInvoiceComponent,
    RenewalInvoiceComponent,
    TopupInvoiceComponent,
    ExtendInvoiceComponent,
    BsnlInvoiceComponent,
    CaInvoiceComponent,
  ],
  imports: [
    pgButton,
    NavModule,
    InputTextModule,
    InputTextareaModule,
    TabsModule,
    CheckboxModule,
    ChartjsModule,
    CommonModule,
    TreeModule,
    TabMenuModule,
    PaginatorModule,
    CalendarModule,
    pgmodel,
    SliderModule,
    SplitButtonModule,
    ToolbarModule,
    EsimRoutingModule,
    OverlayPanelModule,
    RowComponent,
    CardModule,
    CollapseModule,
    AgGridModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    DropdownModule,
    FormModule,
    GridModule,
    ListGroupModule,
    NavModule,
    PaginationModule,
    PlaceholderModule,
    PopoverModule,
    ProgressModule,
    SharedModule,
    SpinnerModule,
    TableModule,
    IconModule,
    TabsModule,
    TooltipModule,
    ModalModule,
    UtilitiesModule,
    ToastModule,
    InputNumberModule,
  ],
  providers: [MessageService],
})
export class EsimModule { }
