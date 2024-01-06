import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EsimActivationPageComponent } from './esim-activation-page/esim-activation-page.component';
import { EsimTopupDetailsComponent } from './esim-topup-details/esim-topup-details.component';
import { EsimTopupOneyearActivationComponent } from './esim-topup-oneyear-activation/esim-topup-oneyear-activation.component';
import { EsimExtendOneyearDetailsComponent } from './esim-extend-oneyear-details/esim-extend-oneyear-details.component';
import { EsimBillingPlanComponent } from './esim-billing-plan/esim-billing-plan.component';
import { EsimAccountMappingComponent } from './esim-account-mapping/esim-account-mapping.component';
import { EsimBillingGenerationComponent } from './esim-billing-generation/esim-billing-generation.component';
import { EsimUsersComponent } from './esim-users/esim-users.component';
import { EsimChangePasswordComponent } from './esim-change-password/esim-change-password.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { EsimProductDetailsComponent } from './esim-products/esim-product-details/esim-product-details.component';
import { SimDetailsUploadComponent } from './sim-details-upload/sim-details-upload.component';
import { EsimAdvancePaymentComponent } from './esim-advance-payment/esim-advance-payment.component';
import { AuthguardService } from '../service/authguard.service';
import { EsimInvoiceComponent } from './esim-invoice/esim-invoice.component';
import { EsimCreateUserComponent } from './esim-create-user/esim-create-user.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesOrderViewComponent } from './sales-order-view/sales-order-view.component';
import { EsimCompanyCreationComponent } from './esim-company-creation/esim-company-creation.component';
import { EsimCompanyActivationComponent } from './esim-company-activation/esim-company-activation.component';
import { EsimAssignICCIDComponent } from './esim-assign-iccid/esim-assign-iccid.component';
import { EsimPurchaseDetailsComponent } from './esim-purchase-details/esim-purchase-details.component';
import { EsimCaRequestComponent } from './esim-requests/esim-ca-request/esim-ca-request.component';
import { EsimRenewalRequestComponent } from './esim-requests/esim-renewal-request/esim-renewal-request.component';
import { EsimExtendValidityRequestComponent } from './esim-requests/esim-extend-validity-request/esim-extend-validity-request.component';
import { EsimTopupRequestComponent } from './esim-requests/esim-topup-request/esim-topup-request.component';
import { EsimCustomerPriceMappingComponent } from './esim-products/esim-customer-price-mapping/esim-customer-price-mapping.component';
import { EsimRequestDetailsComponent } from './esim-request-details/esim-request-details.component';
import { EsimDashboardComponent } from './esim-dashboard/esim-dashboard.component';
import { EsimBsnlCertificateComponent } from './esim-requests/esim-bsnl-certificate/esim-bsnl-certificate.component';
import { PoInvoiceComponent } from './esim-invoice-pages/po-invoice/po-invoice.component';
import { RenewalInvoiceComponent } from './esim-invoice-pages/renewal-invoice/renewal-invoice.component';
import { TopupInvoiceComponent } from './esim-invoice-pages/topup-invoice/topup-invoice.component';
import { ExtendInvoiceComponent } from './esim-invoice-pages/extend-invoice/extend-invoice.component';
import { BsnlInvoiceComponent } from './esim-invoice-pages/bsnl-invoice/bsnl-invoice.component';
import { CaInvoiceComponent } from './esim-invoice-pages/ca-invoice/ca-invoice.component';

const routes: Routes = [
  {
    path: 'esim-activation',
    component: EsimActivationPageComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-topup-oneyear-activation',
    component: EsimTopupOneyearActivationComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-topup-details',
    component: EsimTopupDetailsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-extend-oneyear-details',
    component: EsimExtendOneyearDetailsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-billing-plan',
    component: EsimBillingPlanComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-account-mapping',
    component: EsimAccountMappingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-billing-generation',
    component: EsimBillingGenerationComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-users',
    component: EsimUsersComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-company-creation',
    component: EsimCompanyCreationComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-company-activation',
    component: EsimCompanyActivationComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-change-password',
    component: EsimChangePasswordComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'role-management',
    component: RoleManagementComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-product-details',
    component: EsimProductDetailsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'sim-details-upload',
    component: SimDetailsUploadComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-advance-payment',
    component: EsimAdvancePaymentComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-invoice',
    component: EsimInvoiceComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-user',
    component: EsimCreateUserComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'sales-order',
    component: SalesOrderComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-dashboard',
    component: EsimDashboardComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'sales-order-view',
    component: SalesOrderViewComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-assign-stocks',
    component: EsimAssignICCIDComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-purchase-details',
    component: EsimPurchaseDetailsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-ca-request',
    component: EsimCaRequestComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-renewal-request',
    component: EsimRenewalRequestComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-topup-request',
    component: EsimTopupRequestComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-extend-validity-request',
    component: EsimExtendValidityRequestComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-bsnl-certificate',
    component: EsimBsnlCertificateComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-customer-price-mapping',
    component: EsimCustomerPriceMappingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'esim-request-details',
    component: EsimRequestDetailsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'bsnl-invoice',
    component: BsnlInvoiceComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'po-invoice',
    component: PoInvoiceComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'renewal-invoice',
    component: RenewalInvoiceComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'topup-invoice',
    component: TopupInvoiceComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'extend-invoice',
    component: ExtendInvoiceComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'ca-invoice',
    component: CaInvoiceComponent,
    canActivate: [AuthguardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsimRoutingModule {}
