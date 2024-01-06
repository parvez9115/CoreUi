import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { ExportExcelService } from 'src/app/service/export-excel.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { storeData } from '../../ngRxStore/invoice.Reducer';
import { Router } from '@angular/router';
import { AgGridService } from 'src/app/service/ag-grid-service.service';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  standalone: true,
  template: `<button *ngIf="params.text == 'status'" #button class="button">
      {{ params.data.postatus == 'Not Accept' ? 'Accept' : 'Accepted' }}
    </button>
    <button *ngIf="params.text == 'rejectstatus'" #button class="button">
      {{ params.data.postatus == 'Not Accept' ? 'Reject' : 'Rejected' }}
    </button>
    <button *ngIf="params.text == 'shipped'" #button class="button">
      {{
        params.data.shippingstatus == 'Not Shipped' ? 'Not Shipped' : 'Shipped'
      }}
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
    `,
  ],
})
class disableableButtonRenderer
  implements ICellRendererAngularComp, AfterViewInit
{
  company: string;
  ngAfterViewInit() {
    this.company = localStorage.getItem('usertype');
    if (this.company == 'SuperAdmin') {
      if (this.params.text == 'status') {
        if (this.params.data.postatus == 'Accepted') {
          this.button.nativeElement.disabled = true;
        } else {
          this.button.nativeElement.disabled = false;
        }
      } else if (this.params.text == 'rejectstatus') {
        if (this.params.data.postatus == 'Rejected') {
          this.button.nativeElement.disabled = true;
        } else {
          this.button.nativeElement.disabled = false;
        }
      } else {
        if (this.params.data.shippingstatus == 'Shipped') {
          this.button.nativeElement.disabled = true;
        } else {
          this.button.nativeElement.disabled = false;
        }
      }
    } else {
      if (this.params.text == 'status') {
        if (this.params.data.postatus == 'Accepted') {
          this.button.nativeElement.disabled = true;
        } else {
          this.button.nativeElement.disabled = true;
        }
        if (this.params.data.postatus == 'Rejcted') {
          this.button.nativeElement.disabled = true;
        } else {
          this.button.nativeElement.disabled = true;
        }
      } else {
        if (this.params.data.shippingstatus == 'Shipped') {
          this.button.nativeElement.disabled = true;
        } else {
          this.button.nativeElement.disabled = true;
        }
      }
    }
  }
  params!: any;
  @ViewChild('button', { static: false }) button: ElementRef;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    this.params = params;
    return true;
  }
}

@Component({
  selector: 'app-sales-order-view',
  templateUrl: './sales-order-view.component.html',
  styleUrls: ['./sales-order-view.component.scss'],
})
export class SalesOrderViewComponent {
  invoiceForm: FormGroup;
  payForm: FormGroup;
  shipmentForm: FormGroup;
  acceptForm: FormGroup;
  selectedRowSize: number;
  pagePermission: any;
  trackingDetails: any = {
    orderplacedon: 'Order Placed Date',
    orderacceptedon: 'Order Accepted Date',
    paymentreceivedon: 'Payment Received Date',
    stockassignedon: 'Stock Assigned Date',
    rejectedreason: 'Rejected Reason',
  };
  items = [];
  docData = [];
  data: any = [{ total: 0 }];
  columnDefs: any;
  visiblePrint = false;
  convertToInvoiceModal: boolean = false;
  InvoiceConvertingFunction: void;
  lineData: any;
  date: string;
  label: string;
  selectedRole: any;
  selectedGridData: any;
  ShipmentModalToggle: boolean = false;
  paidstatus;
  shippingdetails;
  acceptConfirm: boolean = false;
  acceptModalToggle: boolean = false;
  rejectModalToggle: boolean = false;
  rejectedModalToggle: boolean = false;
  rejectedpono: any;
  reason = '';
  editData;
  respone = 'Accepted';
  addressOptions: any;
  changeaddressConfirm: boolean = false;
  payData = {};
  address;
  maxDate: string;
  today = new Date();
  tabs: any = [
    { label: 'Pending' },
    { label: 'Accepted' },
    { label: 'Rejected' },
  ];
  activeTab: any = {};
  currenttab: any;
  @ViewChild('myGrid', { static: false }) myGrid: any;
  visiblePay = false;
  public defaultColDef: any = {
    width: 170,
    sortable: true,
    resizable: true,
  };
  rowData = [];
  response: any;
  acceptvalue: any;
  gridApi: any;
  company: string;
  visiblePrintLoader: boolean;
  hoveredDetail: string = '';
  trackorderModalToggle: boolean = false;

  togglePayDemo() {
    this.visiblePay = !this.visiblePay;
  }

  @ViewChild('one') d1: ElementRef;
  @ViewChild('two') d2: ElementRef;

  print() {
    const printContents = document.getElementById('one')?.innerHTML;
    const pageContent = `<!DOCTYPE html><html>  <style type="text/css" media="all">
        @page {
          size: 8.27in 11.69in;
          margin: 0.7in 0 0.7in 0;
          background: #ffffff;

          @bottom-center {
            content: element(footer);
          }

          @top-center {
            content: element(header);
          }
        }

        table {
          border-spacing: 0;
          border-collapse: collapse;
        }

        .pcs-itemtable {
          -fs-table-paginate: paginate;
        }

        img {
          page-break-inside: avoid;
        }

        #pageNumber:before {
          content: counter(page);
        }

        @font-face {
          font-family: "WebFont-";
          src: local(), url();
        }

        .pcs-template {
          font-family: Ubuntu;
          font-size: 9pt;
          color: #333333;
        }

        .pcs-header-content {
          font-size: 9pt;
          color: #333333;
          background-color: #ffffff;
        }

        .pcs-template-body {
          padding: 0 0.4in 0 0.55in;
        }

        .pcs-template-footer {
          height: 0.7in;
          font-size: 6pt;
          color: #aaaaaa;
          padding: 0 0.4in 0 0.55in;
          background-color: #ffffff;
        }

        .pcs-footer-content {
          word-wrap: break-word;
          color: #aaaaaa;
          border-top: 1px solid #adadad;
        }

        .pcs-label {
          color: #333333;
        }
a
        .pcs-entity-title {
          font-size: 28pt;
          color: #000000;
        }

        .pcs-orgname {
          font-size: 10pt;
          color: #333333;
        }

        .pcs-customer-name {
          font-size: 9pt;
          color: #333333;
        }

        .pcs-eori-number {
          color: #333;
          margin: 0;
          padding-top: 10px;
        }

        .pcs-itemtable-header {
          font-size: 9pt;
          color: #ffffff;
          background-color: #3c3d3a;
        }

        .pcs-itemtable-breakword {
          word-wrap: break-word;
        }

        .pcs-taxtable-header {
          font-size: 9pt;
          color: #ffffff;
          background-color: #3c3d3a;
        }

        .breakrow-inside {
          page-break-inside: avoid;
        }

        .breakrow-after {
          page-break-after: auto;
        }

        .pcs-item-row {
          font-size: 9pt;
          border-bottom: 1px solid #adadad;
          background-color: #ffffff;
          color: #000000;
        }

        .pcs-img-fit-aspectratio {
          object-fit: contain;
          object-position: top;
        }

        .pcs-img-border {
          border: 1px solid #f5f4f3;
        }

        .pcs-item-sku,
        .pcs-item-hsn,
        .pcs-item-coupon,
        .pcs-item-serialnumber,
        .pcs-item-unitcode {
          margin-top: 2px;
          font-size: 10px;
          color: #444444;
        }

        .pcs-item-desc {
          color: #727272;
          font-size: 9pt;
        }

        .pcs-balance {
          background-color: #f5f4f3;
          font-size: 9pt;
          color: #000000;
        }

        .pcs-savings {
          font-size: 0pt;
        }

        .pcs-totals {
          font-size: 9pt;
          color: #000000;
          background-color: #ffffff;
        }

        .pcs-notes {
          font-size: 8pt;
        }

        .pcs-terms {
          font-size: 8pt;
        }

        .pcs-header-first {
          background-color: #ffffff;
          font-size: 9pt;
          color: #333333;
          height: auto;
        }

        .pcs-status {
          font-size: 15pt;
          border: 3px solid;
          padding: 3px 8px;
        }

        .billto-section {
          padding-top: 0mm;
          padding-left: 0mm;
        }

        .shipto-section {
          padding-top: 0mm;
          padding-left: 0mm;
        }

        @page :first {
          @top-center {
            content: element(header);
          }

          margin-top: 0.7in;
        }

        .pcs-template-header {
          padding: 0 0.4in 0 0.55in;
          height: 0.7in;
        }

        .pcs-template-fill-emptydiv {
          display: table-cell;
          content: " ";
          width: 100%;
        }

        /* Additional styles for RTL compat */
        /* Helper Classes */
        .inline {
          display: inline-block;
        }

        .v-top {
          vertical-align: top;
        }

        .text-align-right {
          text-align: right;
        }

        .rtl .text-align-right {
          text-align: left;
        }

        .text-align-left {
          text-align: left;
        }

        .rtl .text-align-left {
          text-align: right;
        }

        .float-section-right {
          float: right;
        }

        .rtl .float-section-right {
          float: left;
        }

        .float-section-left {
          float: left;
        }

        .rtl .float-section-left {
          float: right;
        }

        /* Helper Classes End */
        .item-details-inline {
          display: inline-block;
          margin: 0 10px;
          vertical-align: top;
          max-width: 70%;
        }

        .total-in-words-container {
          width: 100%;
          margin-top: 10px;
        }

        .total-in-words-label {
          vertical-align: top;
          padding: 0 10px;
        }

        .total-in-words-value {
          width: 170px;
        }

        .total-section-label {
          padding: 5px 10px 5px 0;
          vertical-align: middle;
        }

        .total-section-value {
          width: 120px;
          vertical-align: middle;
          padding: 10px 10px 10px 5px;
        }

        .rtl .total-section-value {
          padding: 10px 5px 10px 10px;
        }

        .tax-summary-description {
          color: #727272;
          font-size: 8pt;
        }

        .bharatqr-bg {
          background-color: #f4f3f8;
        }

        /* Overrides/Patches for RTL compat */
        .rtl th {
          text-align: inherit;
          /* Specifically setting th as inherit for supporting RTL */
        }

        /* Overrides/Patches End */
        /* Signature styles */
        .sign-border {
          width: 200px;
          border-bottom: 1px solid #000;
        }

        .sign-label {
          display: table-cell;
          font-size: 10pt;
          padding-right: 5px;
        }

        /* Signature styles End */
        /* Subject field styles */
        .subject-block {
          margin-top: 20px;
        }

        .subject-block-value {
          word-wrap: break-word;
          white-space: pre-wrap;
          line-height: 14pt;
          margin-top: 5px;
        }

        /* Subject field styles End*/
        .pcs-sub-label {
          color: #666;
          font-size: 10px;
        }

        .pcs-hsnsummary-compact {
          padding: 0;
          margin-top: 3px;
        }

        .pcs-hsnsummary-label-compact {
          margin-bottom: 3px;
          font-weight: 600;
          padding-left: 3px;
          font-size: 9pt;
        }

        .pcs-hsnsummary-header-compact {
          text-align: right;
          padding: 5px 7px 2px 7px;
          word-wrap: break-word;
          width: 17%;
          height: 32px;
          border-right: 1px solid #9e9e9e;
          font-size: 8pt;
          font-weight: 600;
        }

        .pcs-hsnsummary-body-compact,
        .pcs-hsnsummary-total-compact {
          text-align: right;
          word-wrap: break-word;
          font-size: 7pt;
          padding: 4px 10px;
        }

        .pcs-hsnsummary-total-compact {
          border-top: 1px solid #adadad;
        }

        .pcs-ukvat-summary {
          margin-top: 50px;
          clear: both;
          width: 100%;
        }

        .pcs-ukvat-summary-header {
          padding: 5px 10px 5px 5px;
        }

        .pcs-ukvat-summary-header:first-child {
          padding-left: 10px;
        }

        .pcs-ukvat-summary-label {
          font-size: 10pt;
        }

        .pcs-ukvat-summary-table {
          margin-top: 10px;
          width: 100%;
          table-layout: fixed;
        }

        .pcs-ukvat-summary-body,
        .pcs-ukvat-summary-total {
          padding: 10px 10px 5px 10px;
        }

        .pcs-ukvat-summary-body:first-child {
          padding-bottom: 10px;
          padding-right: 0;
        }

        .pcs-payment-block {
          margin-top: 20px;
        }

        .pcs-payment-block-inner {
          margin-top: 10px;
        }

        .pcs-entity-label-section {
          padding: 5px 10px 5px 0px;
          font-size: 10pt;
        }

        .pcs-colon {
          width: 3%;
        }

        .pcs-w-100 {
          width: 100%;
        }

        .pcs-d-table-cell {
          display: table-cell;
        }

        .pcs-talign-center {
          text-align: center;
        }

        .pcs-wordwrap-bw {
          word-wrap: break-word;
        }

        .pcs-whitespace-pw {
          white-space: pre-wrap;
        }

        .pcs-fw-600 {
          font-weight: 600;
        }

        .pcs-text-uppercase {
          text-transform: uppercase;
        }

        .pcs-table-fixed {
          table-layout: fixed;
        }

        .pcs-valign-middle {
          vertical-align: middle;
        }

        .pcs-clearfix {
          clear: both;
        }

        .lineitem-column {
          padding: 10px 10px 5px 10px;
          word-wrap: break-word;
        }

        .entity-details-padding {
          padding: 5px 10px 5px 0px;
        }

        .rtl .entity-details-padding {
          padding: 5px 0px 5px 10px;
        }

        .line-item-padding {
          padding: 10px 10px 10px 5px;
        }

        .rtl .line-item-padding {
          padding: 10px 5px 10px 10px;
        }
      </style> <head></head><body onload="window.print()">${printContents}</html>`;
    let popupWindow: Window;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWindow = window.open(
        '',
        '_blank',
        'width=1400,height=1600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      );
      popupWindow.window.focus();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
      popupWindow.onbeforeunload = (event) => {
        popupWindow.close();
      };
      popupWindow.onabort = (event) => {
        popupWindow.document.close();
        popupWindow.close();
      };
    } else {
      popupWindow = window.open('', '_blank', 'width=600,height=600');
      popupWindow.document.open();
      popupWindow.document.write(printContents);
      popupWindow.document.close();
    }
  }

  download() {
    const doc = new jsPDF();
    doc.html(this.d1.nativeElement, {
      html2canvas: {
        scale: 595.26 / 3200, //595.26 is the width of A4 page
        scrollY: 0,
      },
      filename: 'jspdf',
      x: 0,
      y: 0,
      callback: (pdf) => {
        pdf.save('Purchase Order');
      },
    });
  }

  downloadInvoice() {
    const doc = new jsPDF();
    doc.html(this.d2.nativeElement, {
      html2canvas: {
        scale: 595.26 / 3200, //595.26 is the width of A4 page
        scrollY: 0,
      },
      filename: 'jspdf',
      x: 0,
      y: 0,
      callback: (pdf) => {
        pdf.save('Invoice');
      },
    });
  }

  printInvoice() {
    const printContents = document.getElementById('two')?.innerHTML;
    const pageContent = `<!DOCTYPE html><html>  <head></head><body onload="window.print()">${printContents}</html>`;
    let popupWindow: Window;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWindow = window.open(
        '',
        '_blank',
        'width=1400,height=1600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      );
      popupWindow.window.focus();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
      popupWindow.onbeforeunload = (event) => {
        popupWindow.close();
      };
      popupWindow.onabort = (event) => {
        popupWindow.document.close();
        popupWindow.close();
      };
    } else {
      popupWindow = window.open('', '_blank', 'width=600,height=600');
      popupWindow.document.open();
      popupWindow.document.write(printContents);
      popupWindow.document.close();
    }
  }

  togglePrint(e) {
    this.loader.presentLoader();

    let url =
      ServerUrl.live +
      '/esim/getAllPurchaseOrderDetails?headerId=' +
      e.data.headerid;
    this.ajaxService.ajaxget(url).subscribe((res: any) => {
      this.loader.dismissLoader();
      this.docData = res['0']['items'];
      this.data = res;
      // this.d1.nativeElement.insertAdjacentHTML(
      //   'beforeend',
      //   this.d2.nativeElement
      // );
      if (!this.visiblePrint) {
        this.visiblePrintLoader = !this.visiblePrint;
        setTimeout(() => (this.visiblePrint = !this.visiblePrint), 200);
      } else {
        this.visiblePrint = !this.visiblePrint;
      }
    });
  }

  toggleConvertToInvoiceModal(e) {
    this.loader.presentLoader();
    let url =
      ServerUrl.live + '/esim/getAllPurchaseOrderDetails?headerId=' + e.data.id;
    this.ajaxService.ajaxget(url).subscribe((res: any) => {
      this.loader.dismissLoader();
      this.docData = res['0']['items'];
      this.data = res;
      this.convertToInvoiceModal = !this.convertToInvoiceModal;
    });
    this.lineData = e;
  }

  visableInvoice = false;

  toggleViewInvoice(e) {
    if (e.data.invoiceid == '') {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Invoice has not been created for this Purchase Order',
      });
      return;
    }
    this.loader.presentLoader();
    let url =
      ServerUrl.live + '/esim/getInvoiceById?invoiceId=' + e.data.invoiceid;
    this.ajaxService.ajaxgetHtml(url).subscribe((res) => {
      this.d2.nativeElement.innerHTML = '';
      this.loader.dismissLoader();
      this.d2.nativeElement.insertAdjacentHTML('beforeend', res);
      this.visableInvoice = !this.visableInvoice;
    });
  }

  handlevisiblePrint(event: any) {
    this.visiblePrint = event;
  }

  handleTrackModalChange(event: any) {
    this.trackorderModalToggle = event;
  }

  handlevisibleIvoice(event: any) {
    this.visableInvoice = event;
  }

  handlePayDemoChange(event: any) {
    this.visiblePay = event;
  }

  handleConvertToInvoiceModal(event: any) {
    this.convertToInvoiceModal = event;
  }

  handleAcceptModalChange(event: any) {
    this.acceptModalToggle = event;
  }

  handleShipmentModalChange(event: any) {
    this.ShipmentModalToggle = event;
  }

  handleChagesaddressModalChange(event: any) {
    this.changeaddressConfirm = event;
  }

  savePaid() {
    this.loader.presentLoader();
    let url = ServerUrl.live + '/esim/saveCustomerPayments';
    let body = {
      customer_id: this.payData['customer_id'],
      invoices: [
        {
          invoice_id: this.payData['invoice_id'],
          amount_applied: this.payForm.value.amount,
        },
      ],
      payment_mode: 'Cash',
      date: this.payForm.value.date,
      exchange_rate: '1',
      amount: this.payForm.value.amount,
      bank_charges: '',
      account_id: '4260517000000000361',
      custom_fields: [],
      documents: [],
    };
    this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
      if (
        JSON.parse(res.Response).message ==
        'The payment from the customer has been recorded'
      ) {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: JSON.parse(res.Response).message,
        });
        this.togglePayDemo();
        this.getGridData();
        this.payData = {};
      } else {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: JSON.parse(res.Response).message,
        });
      }
    });
  }

  hello() {
    alert('shbdh');
  }

  constructor(
    private router: Router,
    private ajaxService: AjaxService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private excel: ExportExcelService,
    private permission: PermissionService,
    private elementRef: ElementRef,
    private store: Store<{ invoiceData: string }>,
    private gridService: AgGridService,
    public gridPagination: GridPaginationService
  ) {}

  createGrid() {
    if (this.currenttab == 'Pending') {
      this.columnDefs = [
        {
          headerName: 'Company Name',
          field: 'companyname',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'Customer Id',
          field: 'customerid',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'PO Date',
          field: 'podate',
          filter: 'agTextColumnFilter',
          width: 150,
        },
        {
          headerName: 'Purchase Order Number',
          field: 'pono',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'Invoice No',
          field: 'invoiceid',
          width: 190,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Total Amount',
          field: 'grandtotal',
          filter: 'agTextColumnFilter',
          width: 170,
        },
        {
          headerName: 'Total Quantity',
          field: 'totalquantity',
          filter: 'agTextColumnFilter',
          width: 170,
        },
      ];

      this.columnDefs.push({
        cellRenderer: disableableButtonRenderer,
        cellRendererParams: {
          text: 'status',
          onCellClicked: (params) => {
            if (params.data.postatus == 'Not Accept') {
              this.getaccept(params);
            }
          },
        },
        width: 120,

        sortable: false,
      });

      this.columnDefs.push({
        width: 130,

        cellRenderer: disableableButtonRenderer,
        cellRendererParams: {
          text: 'rejectstatus',
        },

        onCellClicked: (params) => {
          this.togglerejectModel(params);
        },
        sortable: false,
      });

      if (this.pagePermission.viewpurchaseorder.value) {
        this.columnDefs.push({
          width: 300,

          cellRenderer: ColourCellRenderer,
          cellRendererParams: {
            text: 'View Purchase Order',
          },
          onCellClicked: this.togglePrint.bind(this),
          sortable: false,
        });
      }

      this.columnDefs.push({
        width: 100,

        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Edit',
        },
        onCellClicked: this.editOrder.bind(this),
        sortable: false,
      });
    } else if (this.currenttab == 'Accepted') {
      this.columnDefs = [
        {
          headerName: 'Company Name',
          field: 'companyname',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'Customer Id',
          field: 'customerid',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'PO Date',
          field: 'podate',
          filter: 'agTextColumnFilter',
          width: 150,
        },
        {
          headerName: 'Purchase Order Number',
          field: 'pono',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'Invoice No',
          field: 'invoiceid',
          width: 190,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Total Amount',
          field: 'grandtotal',
          filter: 'agTextColumnFilter',
          width: 170,
        },
        {
          headerName: 'Total Quantity',
          field: 'totalquantity',
          filter: 'agTextColumnFilter',
          width: 170,
        },
        {
          headerName: 'Tracking No',
          field: 'trackingno',
          filter: 'agTextColumnFilter',
          width: 170,
        },
      ];

      this.columnDefs.push({
        width: 160,

        cellRenderer: disableableButtonRenderer,
        cellRendererParams: {
          text: 'shipped',
        },

        onCellClicked: (params) => {
          if (params.data.shippingstatus == 'Not Shipped') {
            this.getshippingdeatil(params);
          }
        },
        sortable: false,
      });

      this.columnDefs.push({
        width: 120,

        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Track',
        },
        onCellClicked: (params) => {
          if (true) {
            this.trackNow(params);
          }
        },
        sortable: false,
      });

      if (this.pagePermission.viewpurchaseorder.value) {
        this.columnDefs.push({
          width: 10,

          cellRenderer: ColourCellRenderer,
          cellRendererParams: {
            text: 'View Purchase Order',
          },
          onCellClicked: this.togglePrint.bind(this),
          sortable: false,
        });
      }

      // this.columnDefs.push({
      //   width: 100,

      //   cellRenderer: ColourCellRenderer,
      //   cellRendererParams: {
      //     text: 'Edit',
      //   },
      //   onCellClicked: this.editOrder.bind(this),
      //   sortable: false,
      // });

      // if (this.pagePermission.converttoinvoice.value) {
      //   this.columnDefs.push({
      //     width: 220,

      //     cellRenderer: ColourCellRenderer,
      //     cellRendererParams: {
      //       text: 'Convert TO INVOICE',
      //     },
      //     onCellClicked: this.toggleConvertToInvoiceModal.bind(this),
      //     sortable: false,
      //   });
      // }
      // if (this.pagePermission.viewinvoice.value) {
      //   this.columnDefs.push({
      //     width: 160,

      //     cellRenderer: ColourCellRenderer,
      //     cellRendererParams: {
      //       text: 'View invoice',
      //     },
      //     onCellClicked: this.toggleViewInvoice.bind(this),
      //     sortable: false,
      //   });
      // }
    } else if (this.currenttab == 'Rejected') {
      this.columnDefs = [
        {
          headerName: 'Company Name',
          field: 'companyname',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'Customer Id',
          field: 'customerid',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'PO Date',
          field: 'podate',
          filter: 'agTextColumnFilter',
          width: 150,
        },
        {
          headerName: 'Purchase Order Number',
          field: 'pono',
          filter: 'agTextColumnFilter',
          width: 200,
        },
        {
          headerName: 'Invoice No',
          field: 'invoiceid',
          width: 190,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Total Amount',
          field: 'grandtotal',
          filter: 'agTextColumnFilter',
          width: 170,
        },
        {
          headerName: 'Total Quantity',
          field: 'totalquantity',
          filter: 'agTextColumnFilter',
          width: 170,
        },
      ];

      if (this.pagePermission.viewpurchaseorder.value) {
        this.columnDefs.push({
          width: 10,
          cellRenderer: ColourCellRenderer,
          cellRendererParams: {
            text: 'View Purchase Order',
          },
          onCellClicked: this.togglePrint.bind(this),
          sortable: false,
        });
      }

      this.columnDefs.push({
        width: 200,

        cellRenderer: ColourCellRenderer,
        cellRendererParams: {
          text: 'Rejected Reason',
        },
        onCellClicked: this.RejectedModal.bind(this),
        sortable: false,
      });
    }
  }

  deleteRow(index) {
    const add = this.invoiceForm.get('invoiceFields') as FormArray;
    if (add.length > 1) {
      add.removeAt(index);
    }
  }
  trackOModel() {
    this.trackorderModalToggle = !this.trackorderModalToggle;
  }

  trackNow(event) {
    this.hoveredDetail = '';
    var url =
      ServerUrl.live + '/esim/trackOrders?headerId=' + event.data.headerid;
    this.ajaxService.ajaxget(url).subscribe((response) => {
      this.trackingDetails = response;
      this.trackOModel();

      let deliveryProgress: number;

      switch (this.trackingDetails.status) {
        case 'Order placed':
          deliveryProgress = 0;
          break;
        case 'Order accepted':
          deliveryProgress = 25;
          break;
        case 'Payment processed':
          deliveryProgress = 50;
          break;
        case 'Stock assigned':
          deliveryProgress = 75;
          break;
        case 'Product shipped':
          deliveryProgress = 100;
          break;
        default:
          deliveryProgress = 0;
          break;
      }

      this.updateDeliveryProgress(deliveryProgress);
    });
  }

  updateDeliveryProgress(progress: number): void {
    const rangeProgress: HTMLElement | null =
      document.querySelector('.range-progress');
    if (rangeProgress) {
      rangeProgress.style.setProperty('--progress-width', `${progress}%`);
    }

    const statusElements: NodeListOf<Element> =
      document.querySelectorAll('.status');
    const currentStage: number = Math.floor(progress / 25);
    statusElements.forEach((element: Element, index: number) => {
      if (index <= currentStage) {
        element.classList.add('active');
      } else {
        element.classList.remove('active'); // Deactivate elements beyond the current stage
      }
    });

    const stageCircles: NodeListOf<Element> =
      document.querySelectorAll('.stage-circle');

    const activateCircles = (index: number): void => {
      const circle = stageCircles[index] as HTMLElement | null;
      if (circle) {
        circle.classList.add('active');
      }
    };

    stageCircles.forEach((circle: Element, index: number) => {
      let circlePosition: number = (index + 0) * 25;
      if (progress >= circlePosition) {
        activateCircles(index);
      } else {
        circle.classList.remove('active');
      }
    });

    const activeCircles = document.querySelectorAll('.stage-circle.active');
    if (activeCircles.length > 0) {
      const lastActiveCircle = activeCircles[activeCircles.length - 1];
      const lastActiveCircleIndex =
        Array.from(stageCircles).indexOf(lastActiveCircle);

      const statusElements = document.querySelectorAll('.status');
      statusElements.forEach((element, index) => {
        if (index > lastActiveCircleIndex) {
          element.classList.add('disabled');
        } else {
          element.classList.remove('disabled');
        }
      });
    }
  }

  displayDetail(detail: string | undefined, title: string | undefined) {
    if (detail && title) {
      this.hoveredDetail = `${title}: ${detail}`;
    }
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    let suffix = 'th';

    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      suffix = 'st';
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      suffix = 'nd';
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      suffix = 'rd';
    }

    const month = months[date.getMonth()];

    return `${dayOfWeek}, ${('0' + dayOfMonth).slice(-2)}${suffix} ${month}`;
  }
  toggleAcceptModel() {
    this.acceptModalToggle = !this.acceptModalToggle;
  }

  getaccept(event) {
    this.toggleAcceptModel();
    let url =
      ServerUrl.live + '/esim/getZohoPOInvoiceHeader?pono=' + event.data.pono;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.acceptvalue = res;

      this.acceptForm.patchValue({
        customerid: this.acceptvalue.customerid,
        ponumber: this.acceptvalue.pono,
        podate: this.acceptvalue.podate,
        totalqty: this.acceptvalue.totalquantity,
        totalamount: this.acceptvalue.totalamount,
      });
    });
  }

  toggleConfirm() {
    this.acceptConfirm = !this.acceptConfirm;
  }

  accept() {
    var data;
    data = {
      pono: this.acceptvalue.pono,
      stockowner: this.acceptvalue.customerid,
      invoicedate: this.date,
      noofunits: this.acceptvalue.totalquantity,
      createdby: localStorage.getItem('userName'),
    };
    this.loader.presentLoader();
    let url = ServerUrl.live + '/esim/saveZohoPOInvoiceHeader';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      this.loader.dismissLoader();
      if (res.message == 'Requested Invoice Details Saved Successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: 'Purchase Order Accepted Successfully',
        });
        this.getGridData();
        this.toggleConfirm();
        this.toggleAcceptModel();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: res.message,
        });
        this.toggleConfirm();
      }
    });
  }

  togglerejectModel(event?) {
    this.rejectedpono = event.data.pono;
    this.rejectModalToggle = event;
  }

  toggleReject() {
    this.rejectModalToggle = !this.rejectModalToggle;
    this.reason = '';
  }

  rejected() {
    var data;
    data = {
      reason: this.reason,
    };
    var url = ServerUrl.live + '/esim/rejectPO?pono=' + this.rejectedpono;
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      if (res.message == 'Purchase order rejected') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.toggleReject();
        this.getGridData();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: res.message,
        });
      }
    });
  }

  RejectedModal(event?) {
    this.reason = event.data.rejectedreason;
    this.rejectedModalToggle = event;
  }

  Rejectedtoggle() {
    this.rejectedModalToggle = !this.rejectedModalToggle;
    this.reason = '';
  }

  toggleShipmentModal() {
    this.ShipmentModalToggle = !this.ShipmentModalToggle;
    this.clear();
  }

  getshippingdeatil(event) {
    if (event.data.paidstatus == 'Paid') {
      var url =
        ServerUrl.live +
        '/esim/getPOShippingAddress?pono=' +
        event.data.pono +
        '&stockowner=' +
        event.data.customerid;
      this.ajaxService.ajaxget(url).subscribe((response) => {
        this.shippingdetails = response;
        this.getAddress();
        this.shipmentForm.patchValue({
          ponumber: this.shippingdetails.pono,
          billingaddress: this.shippingdetails.billingaddress,
          shippingaddress: this.shippingdetails.shippingaddress,
        });
        this.shipmentForm.get('ponumber').disable();
      });

      this.toggleShipmentModal();
    } else {
      this.messageService.add({
        key: 'toast1',
        severity: 'error',
        summary: 'Error',
        detail: 'Payment has been not Accepted',
      });
    }
  }

  openchangeaddress() {
    this.changeaddressConfirm = !this.changeaddressConfirm;
  }

  getAddress() {
    let url =
      ServerUrl.live +
      '/esim/getShippingAddressByUserId?userId=' +
      this.shippingdetails.companyname;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.addressOptions = res;
    });
  }

  updateadress() {
    this.openchangeaddress();
    this.address;
    let address = this.addressOptions.filter(
      (d) => d.full_address == this.address
    );
    this.response = address[0];
    this.shipmentForm.patchValue({
      shippingaddress: this.response.full_address,
    });
  }

  tabChanged(event: any = { label: 'Pending' }) {
    this.currenttab = event.label;
    if (this.currenttab == 'Pending') {
      this.loader.presentLoader();
      var url =
        ServerUrl.live +
        '/esim/getAllPurchaseOrderPending?companyId=' +
        localStorage['userName'] +
        '&page=' +
        this.gridPagination.currentPage;
      if (this.gridPagination.isSearched) {
        url = url + '&Search=' + this.gridPagination.searchTerm;
      }
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        let countUrl =
          '/esim/getAllCountPurchaseOrderPending?companyId=' +
          localStorage['userName'];
        if (this.gridPagination.isSearched) {
          countUrl = countUrl + '&Search=' + this.gridPagination.searchTerm;
        }
        this.gridPagination.getTotalRecords(countUrl);
        // setTimeout(() => {
        //   this.gridService.autoSizeColumns(this.gridApi);
        // }, 300);
        this.createGrid();
        this.loader.dismissLoader();
      });
    } else if (this.currenttab == 'Accepted') {
      this.loader.presentLoader();
      var url =
        ServerUrl.live +
        '/esim/getAllPurchaseOrderAccepted?companyId=' +
        localStorage['userName'] +
        '&page=' +
        this.gridPagination.currentPage;
      if (this.gridPagination.isSearched) {
        url = url + '&Search=' + this.gridPagination.searchTerm;
      }
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        let countUrl =
          '/esim/getAllCountPurchaseOrderAccepted?companyId=' +
          localStorage['userName'];
        if (this.gridPagination.isSearched) {
          countUrl = countUrl + '&Search=' + this.gridPagination.searchTerm;
        }
        this.gridPagination.getTotalRecords(countUrl);
        // setTimeout(() => {
        //   this.gridService.autoSizeColumns(this.gridApi);
        // }, 0);
        this.createGrid();
        this.loader.dismissLoader();
      });
    } else if (this.currenttab == 'Rejected') {
      this.loader.presentLoader();
      var url =
        ServerUrl.live +
        '/esim/getAllPurchaseOrderRejected?companyId=' +
        localStorage['userName'] +
        '&data=' +
        this.currenttab +
        '&page=' +
        this.gridPagination.currentPage;
      if (this.gridPagination.isSearched) {
        url = url + '&Search=' + this.gridPagination.searchTerm;
      }
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.rowData = res;
        let countUrl =
          '/esim/getAllCountPurchaseOrderRejected?companyId=' +
          localStorage['userName'];
        if (this.gridPagination.isSearched) {
          countUrl = countUrl + '&Search=' + this.gridPagination.searchTerm;
        }
        this.gridPagination.getTotalRecords(countUrl);
        // setTimeout(() => {
        //   this.gridService.autoSizeColumns(this.gridApi);
        // }, 0);
        this.loader.dismissLoader();
        this.createGrid();
        this.loader.dismissLoader();
      });
    }
  }

  clear() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.shipmentForm = this.formBuilder.group({
      ponumber: '',
      trackingdate: today,
      trackingno: '',
      billingaddress: '',
      shippingaddress: '',
    });
  }

  submit() {
    let address = this.addressOptions.filter(
      (d) => d.full_address == this.shipmentForm.value.shippingaddress
    );
    this.response = address[0];

    var data;
    data = {
      pono: this.shippingdetails.pono.toString(),
      addressid: this.response.id.toString(),
      trackingno: this.shipmentForm.value.trackingno.toString(),
      trackingdate: this.shipmentForm.value.trackingdate.toString(),
    };
    var url = ServerUrl.live + '/esim/savePOTracking';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((response) => {
      if (response.message == 'PO Tracking Details Saved Successfully') {
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.getGridData();
        this.toggleShipmentModal();
        this.clear();
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      }
    });
  }

  // toggleAcceptModel() {
  //   this.acceptModalToggle = !this.acceptModalToggle;
  // }

  // getaccept(event) {
  //   this.toggleAcceptModel();
  //   let url =
  //     ServerUrl.live + '/esim/getZohoPOInvoiceHeader?pono=' + event.data.pono;
  //   this.ajaxService.ajaxget(url).subscribe((res) => {
  //     this.acceptvalue = res;

  //     this.acceptForm.patchValue({
  //       customerid: this.acceptvalue.customerid,
  //       ponumber: this.acceptvalue.pono,
  //       podate: this.acceptvalue.podate,
  //       totalqty: this.acceptvalue.totalquantity,
  //       totalamount: this.acceptvalue.totalamount,
  //     });
  //   });
  // }

  // toggleConfirm() {
  //   this.acceptConfirm = !this.acceptConfirm;
  // }

  // accept() {
  //   var data;
  //   data = {
  //     pono: this.acceptvalue.pono,
  //     stockowner: this.acceptvalue.customerid,
  //     invoicedate: this.date,
  //     noofunits: this.acceptvalue.totalquantity,
  //     createdby: localStorage.getItem('userName'),
  //   };
  //   this.loader.presentLoader();
  //   let url = ServerUrl.live + '/esim/saveZohoPOInvoiceHeader';
  //   this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
  //     this.loader.dismissLoader();
  //     if (res.message == 'Requested Invoice Details Saved Successfully') {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Purchase Order Accepted Successfully',
  //       });
  //       this.onGridReady();
  //       this.toggleConfirm();
  //       this.toggleAcceptModel();
  //     } else {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: res.message,
  //       });
  //     }
  //   });
  // }

  // toggleShipmentModal() {
  //   this.ShipmentModalToggle = !this.ShipmentModalToggle;
  // }

  // getshippingdeatil(event) {
  //   if (event.data.postatus == 'Accepted') {
  //     if (event.data.paidstatus == 'Paid') {
  //       var url =
  //         ServerUrl.live +
  //         '/esim/getPOShippingAddress?pono=' +
  //         event.data.pono +
  //         '&stockowner=' +
  //         event.data.customerid;
  //       this.ajaxService.ajaxget(url).subscribe((response) => {
  //         this.shippingdetails = response;
  //         this.getAddress();
  //         this.shipmentForm.patchValue({
  //           ponumber: this.shippingdetails.pono,
  //           billingaddress: this.shippingdetails.billingaddress,
  //           shippingaddress: this.shippingdetails.shippingaddress,
  //         });
  //       });

  //       this.toggleShipmentModal();
  //     } else {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Payment has been not Accepted',
  //       });
  //     }
  //   } else {
  //     this.messageService.add({
  //       key: 'toast1',
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: 'PO has been Not Accepted',
  //     });
  //   }
  // }

  // openchangeaddress() {
  //   this.changeaddressConfirm = !this.changeaddressConfirm;
  // }

  // getAddress() {
  //   let url =
  //     ServerUrl.live +
  //     '/esim/getShippingAddressByUserId?userId=' +
  //     this.shippingdetails.companyname;
  //   this.ajaxService.ajaxget(url).subscribe((res) => {
  //     this.addressOptions = res;
  //   });
  // }

  // updateadress() {
  //   this.openchangeaddress();
  //   this.address;
  //   let address = this.addressOptions.filter((d) => d.address == this.address);
  //   this.response = address[0];
  //   this.shipmentForm.patchValue({
  //     shippingaddress: this.response.address,
  //   });
  // }

  // clear() {
  //   this.shipmentForm = this.formBuilder.group({
  //     ponumber: '',
  //     trackingdate: '',
  //     trackingno: '',
  //     billingaddress: '',
  //     shippingaddress: '',
  //   });
  // }

  // submit() {
  //   let address = this.addressOptions.filter(
  //     (d) => d.address == this.shipmentForm.value.shippingaddress
  //   );
  //   this.response = address[0];

  //   var data;
  //   data = {
  //     pono: this.shipmentForm.value.ponumber.toString(),
  //     addressid: this.response.id.toString(),
  //     trackingno: this.shipmentForm.value.trackingno.toString(),
  //     trackingdate: this.shipmentForm.value.trackingdate.toString(),
  //   };
  //   var url = ServerUrl.live + '/esim/savePOTracking';
  //   this.ajaxService.ajaxPostWithBody(url, data).subscribe((response) => {
  //     if (response.message == 'PO Tracking Details Saved Successfully') {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: response.message,
  //       });
  //       this.onGridReady();
  //       this.toggleShipmentModal();
  //       this.clear();
  //     } else {
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: response.message,
  //       });
  //     }
  //   });
  // }

  editOrder(e) {
    let url =
      ServerUrl.live +
      '/esim/getAllPurchaseOrderDetails?headerId=' +
      e.data.headerid;
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res: any) => {
      this.loader.dismissLoader();
      if (res[0]['invoiceid'] != '') {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail:
            'Cannot edit the purchase order for which invoice has been already generated',
        });
        return;
      }
      res[0]['headerid'] = e.data.headerid;
      res[0]['addressid'] = e.data.addressid;
      this.store.dispatch(storeData({ data: res }));
      this.router.navigateByUrl('/sales-order');
    });
  }

  pay() {
    this.toggleConvertToInvoiceModal;
    this.loader.presentLoader();
    let e = this.lineData;
    let url = ServerUrl.live + '/esim/createInvoice?headerId=' + e.data.id;
    this.ajaxService.ajaxget(url).subscribe((res) => {
      if (res.message == 'Invoice has been generated successfully') {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });

        this.getGridData();
        var copyText = document.createElement('input');
        copyText.value = res.invoiceid;
        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);
      } else {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: res.message,
        });
      }
    });
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
        if (
          coloumnArray.includes(k[j]) == false ||
          k[j].includes('customerid')
        ) {
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
      title: 'Purchase Order',
      data: forExcel,
      headers: Header,
    };
    this.excel.exportExcel(reportData);
  }

  onGridReady(event) {
    this.gridApi = event;
    this.getGridData();
  }

  getGridData(currentPage?) {
    currentPage ? this.tabChanged(currentPage) : this.tabChanged();
    // this.loader.presentLoader();
    // var url =
    //   ServerUrl.live +
    //   '/esim/getAllPurchaseOrder?companyId=' +
    //   localStorage['userName'];
    // this.ajaxService.ajaxget(url).subscribe((res) => {
    //   this.rowData = res;
    //   setTimeout(() => {
    //     this.gridService.autoSizeColumns(this.gridApi);
    //   }, 0);
    //   this.loader.dismissLoader();
    // });
  }

  handlePagination(type) {
    this.gridPagination.handlePagination(type);
    this.getGridData({ label: this.currenttab });
  }

  getItems() {
    let url =
      ServerUrl.live +
      '/esim/getAllProductDetail?userId=' +
      localStorage['userName'];
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.items = res;
    });
  }

  subscribe: Subscription;
  total: number = 0.0;

  subtotal: number = 0.0;

  dateVaidators(AC: AbstractControl) {
    if (
      (new String(AC.value) &&
        new String(AC.value) &&
        !moment(AC.value, 'YYYY-MM-DD', true).isValid()) ||
      new String(AC.value).slice(0, 2) == '00'
    ) {
      return { invalidYear: true };
    }

    return null;
  }
  ngOnInit() {
    this.pagePermission = this.permission.getPermissionDetails(
      'View Purchase Order'
    );
    this.getItems();
    this.activeTab = this.tabs[0];
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.date = today;

    this.maxDate = this.today.getFullYear() + '-';
    this.maxDate +=
      (this.today.getMonth() + 1 < 10
        ? '0' + (this.today.getMonth() + 1).toString()
        : (this.today.getMonth() + 1).toString()) + '-';
    this.maxDate +=
      this.today.getDate() < 10
        ? '0' + this.today.getDate().toString()
        : this.today.getDate().toString();

    //[{ name: "Check" }, { name: "Cash" }, { name: "Bank Tranfser" }, { name: "Credit Card" }, { name: "Bank Remittance" }];

    // this.subscribe = this.invoiceForm.controls[
    //   'discount'
    // ].valueChanges.subscribe((data) => {
    //   this.total = data.reduce((a, b) => a + b.amount, 0);
    //   this.subtotal =
    //     this.subtotal * ((100 - this.invoiceForm.value.discount) / 100);
    // });

    this.payForm = this.formBuilder.group({
      date: [today, Validators.required],
      amount: [0, Validators.required],
    });
    this.shipmentForm = this.formBuilder.group({
      ponumber: ['', Validators.required],
      trackingdate: [today, Validators.required],
      trackingno: ['', Validators.required],
      billingaddress: [''],
      shippingaddress: [''],
    });
    this.acceptForm = this.formBuilder.group({
      customerid: [''],
      ponumber: [''],
      podate: [''],
      invoicedate: [today],
      totalqty: [''],
      totalamount: [''],
    });
    this.acceptForm.get('customerid').disable();
    this.acceptForm.get('ponumber').disable();
    this.acceptForm.get('podate').disable();
    this.acceptForm.get('invoicedate').disable();
    this.acceptForm.get('totalqty').disable();
    this.acceptForm.get('totalamount').disable();
  }
}
