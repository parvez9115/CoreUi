import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, Subscription, filter } from 'rxjs';
import { AjaxService } from 'src/app/service/ajax-service.service';
import { LoaderService } from 'src/app/service/loader.service';
import { PermissionService } from 'src/app/service/permission.service';
import { ServerUrl } from 'src/environment';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { resetData } from 'src/app/ngRxStore/invoice.Reducer';
import { Router } from '@angular/router';
import { CountryServiceService } from 'src/app/service/country-service.service';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss'],
  animations: [
    trigger('fadeOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0, transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class SalesOrderComponent implements OnDestroy, AfterViewInit {
  invoiceForm: FormGroup;
  addressform: FormGroup;
  formIndex = 0;
  payForm: FormGroup;
  selectedRowSize: number;
  pagePermission: any;
  visible = false;
  items = [];
  filteredItems = [];
  filteredSelectedItems = [];
  docData = [];
  data: any = [{ total: 0 }];
  addressOptions: any;
  address: string;
  isAddressEdit: boolean;
  addressId: any;
  minQuantity = [];
  invoiceData$: Observable<any>;
  invoiceData: any;
  errors: any;
  selectedItemsId = [];
  itemsData = [];
  @ViewChild('amount', { static: false }) amountInput: any;
  @ViewChild('rate', { static: false }) rateInput: any;
  @ViewChild('companyDropdown', { static: false }) companyDropdown: any;
  countries = [];
  state = [];
  city = [];
  companies: any;
  filteritems: any;
  company: string;
  submitButton: string = 'Place Order';
  checkqty: any;
  itemsvalue: any;
  togglePayDemo() {
    this.visiblePay = !this.visiblePay;
  }
  handleModalChange(event: any) {
    this.visible = event;
  }
  toggleModal(d?) {
    if (d == true) {
      this.address = '';
    }
    if (this.company == 'SuperAdmin') {
      if (
        this.invoiceForm.value.orderFor != '' &&
        this.invoiceForm.value.orderFor != null
      ) {
        this.visible = !this.visible;
      } else {
        this.messageService.add({
          key: 'toast1',
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please Choose the Company to Add the New Address',
        });
      }
    } else {
      this.visible = !this.visible;
    }
    this.addressform.reset();
    if (!this.visible) {
      this.isAddressEdit = false;
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

  onChangeCountry(event, type) {
    if (type == 'country') {
      this.state = [];
      console.log(this.addressform.value.country);
      let states = this.countryService.region[this.addressform.value.country];
      for (let state of states) {
        this.state.push({ name: state });
      }
      this.addressform.controls['state'].enable();
      if (
        this.addressform.value.country == undefined ||
        this.addressform.value.country == ''
      ) {
        this.addressform.value.state = '';
      }
    }
    this.onChangeState({}, 'state');
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
  toolbarsave = [
    {
      label: 'Clear',
      icon: 'pi pi-times',
      command: () => {
        this.clearAll();
      },
    },
  ];
  constructor(
    private router: Router,
    private ajaxService: AjaxService,
    private countryService: CountryServiceService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private permission: PermissionService,
    private store: Store<{ invoiceData }>
  ) {}

  ngAfterViewInit(): void {
    this.amountInput ? (this.amountInput.readonly = true) : null;
    this.rateInput ? (this.rateInput.readonly = true) : null;

    this.companyDropdown
      ? (this.companyDropdown.readonly = this.invoiceData != null)
      : null;
    this.companyDropdown
      ? (this.companyDropdown.showClear = this.invoiceData == null)
      : null;
  }
  payData = {};

  @ViewChild('myGrid', { static: false }) myGrid: any;
  visiblePay = false;

  deleteRow(index) {
    const arr = this.invoiceForm.get('invoiceFields') as FormArray;
    this.itemsData.splice(index, 1);
    this.minQuantity.splice(index, 1);
    let value = arr.value[index].item;
    this.filteredSelectedItems.splice(index, 1);
    arr.removeAt(index);
    if (value) {
      this.modifyFilteredItems(value);
    }
    this.filterSelectedItem();
  }
  pay(e) {
    this.loader.presentLoader();
    let url = ServerUrl.live + '/esim/createInvoice?headerId=' + e.data.id;

    this.ajaxService.ajaxget(url).subscribe((res) => {
      if (res.message == 'Invoice generated successfully') {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.clearAll();
        var copyText = document.createElement('input');
        copyText.value = res.invoiceid;
        copyText.select();
        copyText.setSelectionRange(0, 99999);
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

  getName(data) {
    return this.items.filter((d) => d.id == data);
  }

  getErrors(controls, index) {
    for (let keys in controls) {
      if (controls[keys].errors)
        this.errors.push([keys, index, controls[keys].errors]);
      if (controls[keys].controls) {
        if (Array.isArray(controls)) index++;
        this.getErrors(controls[keys].controls, index);
      }
    }
  }

  getCompanies() {
    let url = ServerUrl.live + '/esim/getAllCompanies';
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.companies = res;
    });
  }

  save() {
    let { deliveryDate, invoiceFields, address } = this.invoiceForm.value;

    if (invoiceFields.length < 1) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please add a product to create purchase order',
      });
      return;
    } else if (this.invoiceForm.invalid) {
      this.errors = [];
      this.getErrors(this.invoiceForm.controls, 0);

      let length = this.errors.length - 1;
      if (length > -1) {
        if (this.submitButton == 'Edit Order') {
          this.errors = [];
          this.getErrors(this.invoiceForm.controls, 0);

          let length = this.errors.length - 1;
          let data = this.items.filter(
            (d) => d.productname == this.invoiceData.items[0].productname
          );
          this.checkqty = data[0].minorderqty;
          this.errors[length][2].min.min = parseInt(this.checkqty);
          if (
            this.errors[length][2].min.min > this.errors[length][2].min.actual
          ) {
            this.messageService.add({
              key: 'toast1',
              severity: 'warn',
              summary: 'Warning',
              detail:
                'The Quantity of Item in the row ' +
                this.errors[length][1] +
                ' is lesser than minimum quanity ' +
                this.errors[length][2].min.min,
            });
          }
        }
        if (this.submitButton == 'Place Order') {
          if (this.errors[length][0] == 'quantity') {
            this.messageService.add({
              key: 'toast1',
              severity: 'warn',
              summary: 'Warning',
              detail:
                'The Quantity of Item in the row ' +
                this.errors[length][1] +
                ' is lesser than minimum quanity ' +
                this.errors[length][2].min.min,
            });
          } else {
            let msg =
              this.errors[length][0] == 'item'
                ? 'Choose an Item in row ' + this.errors[length][1]
                : this.errors[length][0] == 'address'
                ? 'Delivery address is required'
                : this.errors[length][0] == 'orderFor'
                ? 'Please choose the company you are ordering for.'
                : 'This Form is not Valid';
            this.messageService.add({
              key: 'toast1',
              severity: 'warn',
              summary: 'Warning',
              detail: msg,
            });
          }
        }
      }
      return;
    }

    // let data = this.addressOptions.filter(
    //   (value) => value.id == this.invoiceForm.value.address.id
    // );

    let selectaddress = this.invoiceForm.value.address;

    this.loader.presentLoader();
    var url = ServerUrl.live + '/esim/createPurchaseOrder';
    let body = {};

    body['createdby'] = localStorage['userName'];
    body['headerid'] =
      this.invoiceData == null ? '' : this.invoiceData.headerid.toString();
    body['address'] = '';
    body['addressid'] = selectaddress.toString();
    body['grandtotal'] = this.total.toFixed(2).toString();
    body['customerid'] = this.pagePermission.orderforcompany.value
      ? this.invoiceForm.value.orderFor == ''
        ? localStorage['userName']
        : this.invoiceForm.value.orderFor
      : localStorage['userName'];
    body['lineitems'] = [];
    body['deliverydate'] = deliveryDate;
    invoiceFields.map((d, i) => {
      body['lineitems'].push({
        id: d.id ? d.id.toString() : '',
        productname: this.getName(d.item)[0]['productname'],
        productprice: d.rate.toString(),
        description: d.description == null ? '' : d.description,
        quantity: d.quantity.toString(),
        totalamount: (d.quantity * d.rate).toString(),
      });
    });
    this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
      if (res.message == 'Purchase order created successfully') {
        this.loader.dismissLoader();
        this.messageService.add({
          key: 'toast1',
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.clearAll();
        var copyText = document.createElement('input');
        copyText.value = res.pono;
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
      } else {
        if (res.message == 'Purchase order edited successfully') {
          this.loader.dismissLoader();
          this.messageService.add({
            key: 'toast1',
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          setTimeout(() => {
            this.router.navigateByUrl('/sales-order-view');
          }, 1000);
          this.clearAll();
          var copyText = document.createElement('input');
          copyText.value = res.pono;
          copyText.select();
          copyText.setSelectionRange(0, 99999);
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
      }
    });
  }

  // save() {
  //   let { deliveryDate, invoiceFields, address } = this.invoiceForm.value;
  //   if (invoiceFields.length < 1) {
  //     this.messageService.add({
  //       key: 'toast1',
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail: 'Please add a product to create purchase order',
  //     });
  //     return;
  //   } else if (this.invoiceForm.invalid) {
  //     this.errors = [];
  //     this.getErrors(this.invoiceForm.controls, 0);
  //     console.log(this.errors);
  //     let length = this.errors.length - 1;
  //     if (length > -1) {
  //       if (this.errors[length][0] == 'quantity') {
  //         this.messageService.add({
  //           key: 'toast1',
  //           severity: 'warn',
  //           summary: 'Warning',
  //           detail:
  //             'The Quantity of Item in the row ' +
  //             this.errors[length][1] +
  //             ' is lesser than minimum quanity ' +
  //             this.errors[length][2].min.min,
  //         });
  //       } else {
  //         let msg =
  //           this.errors[length][0] == 'item'
  //             ? 'Choose an Item in row ' + this.errors[length][1]
  //             : this.errors[length][0] == 'address'
  //             ? 'Delivery address is required'
  //             : this.errors[length][0] == 'orderFor'
  //             ? 'Please choose the company you are ordering for.'
  //             : 'This Form is not Valid';
  //         this.messageService.add({
  //           key: 'toast1',
  //           severity: 'warn',
  //           summary: 'Warning',
  //           detail: msg,
  //         });
  //       }
  //     }
  //     return;
  //   }
  //   this.loader.presentLoader();
  //   var url = ServerUrl.live + '/esim/createPurchaseOrder';
  //   let body = {};

  //   body['createdby'] = localStorage['userName'];
  //   body['headerid'] =
  //     this.invoiceData == null ? '' : this.invoiceData.headerid.toString();
  //   body['address'] = '';
  //   body['addressid'] = address.toString();
  //   body['grandtotal'] = this.total.toFixed(2).toString();
  //   body['customerid'] = this.pagePermission.orderforcompany.value
  //     ? this.invoiceForm.value.orderFor == ''
  //       ? localStorage['userName']
  //       : this.invoiceForm.value.orderFor
  //     : localStorage['userName'];
  //   body['lineitems'] = [];
  //   body['deliverydate'] = deliveryDate;
  //   invoiceFields.map((d, i) => {
  //     body['lineitems'].push({
  //       id: d.id ? d.id.toString() : '',
  //       productname: this.getName(d.item)[0]['productname'],
  //       productprice: d.rate.toString(),
  //       description: d.description == null ? '' : d.description,
  //       quantity: d.quantity.toString(),
  //       totalamount: (d.quantity * d.rate).toString(),
  //     });
  //   });
  //   this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
  //     if (res.message == 'Purchase order created successfully') {
  //       this.loader.dismissLoader();
  //       this.messageService.add({
  //         key: 'toast1',
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: res.message,
  //       });
  //       this.clearAll();
  //       var copyText = document.createElement('input');
  //       copyText.value = res.pono;
  //       copyText.select();
  //       copyText.setSelectionRange(0, 99999);
  //       navigator.clipboard.writeText(copyText.value);
  //     } else {
  //       if (res.message == 'Purchase order edited successfully') {
  //         this.loader.dismissLoader();
  //         this.messageService.add({
  //           key: 'toast1',
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: res.message,
  //         });
  //         setTimeout(() => {
  //           this.router.navigateByUrl('/sales-order-view');
  //         }, 1000);
  //         this.clearAll();
  //         var copyText = document.createElement('input');
  //         copyText.value = res.pono;
  //         copyText.select();
  //         copyText.setSelectionRange(0, 99999);
  //         navigator.clipboard.writeText(copyText.value);
  //       } else {
  //         this.loader.dismissLoader();
  //         this.messageService.add({
  //           key: 'toast1',
  //           severity: 'warn',
  //           summary: 'Warning',
  //           detail: res.message,
  //         });
  //       }
  //     }
  //   });
  // }

  getItems() {
    if (this.company == 'Admin') {
      let url =
        ServerUrl.live +
        '/esim/getAllProductDetail?userId=' +
        localStorage['userName'];
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.items = res;
        let data = this.items.filter((d) => d.cardstatus == 'New Sim');
        this.filteritems = data;

        this.filteredSelectedItems[0] = JSON.parse(JSON.stringify(res));
        if (this.invoiceData != null) {
          for (let i = 0; i < this.invoiceData.items.length; i++) {
            this.filteredSelectedItems[i] = JSON.parse(JSON.stringify(res));
            this.filterSelectedItem();
          }
          this.filterSelectedItem();
        }
      });
    }
  }

  subscribe: any;
  total: number = parseInt((0).toFixed(2));

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

  editAddress(data) {
    this.addressId = data.id;
    this.isAddressEdit = true;
    this.toggleModal();
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
    // setTimeout(() => {
    //   this.invoiceForm.patchValue({ address: '' });
    // }, 0);
  }

  ngOnDestroy() {
    this.store.dispatch(resetData());
  }

  getAddress() {
    let url =
      ServerUrl.live +
      '/esim/getShippingAddressByUserId?userId=' +
      localStorage['userName'];
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.addressOptions = res;
    });
  }

  getAddressFor(event) {
    let arr = this.invoiceForm.get('invoiceFields') as FormArray;
    let array = arr.controls[0] as FormGroup;
    let url =
      ServerUrl.live +
      '/esim/getShippingAddressByUserId?userId=' +
      (event.value ? event.value : localStorage.getItem('userName'));
    this.loader.presentLoader();
    this.ajaxService.ajaxget(url).subscribe((res) => {
      this.loader.dismissLoader();
      this.addressOptions = res;
      if (this.invoiceData) {
        this.invoiceForm.patchValue({
          address: this.invoiceData.addressid.toString(),
        });
      }
    });
    if (event.value) {
      array.controls['item'].enable();
    } else {
      array.controls['item'].disable();
    }
    let urlItem =
      ServerUrl.live +
      '/esim/getAllProductDetail?userId=' +
      (event.value ? event.value : localStorage.getItem('userName'));
    this.ajaxService.ajaxget(urlItem).subscribe((res) => {
      this.items = res;
      let data = this.items.filter((d) => d.cardstatus == 'New Sim');
      this.filteritems = data;
      this.filteredSelectedItems[0] = JSON.parse(JSON.stringify(res));
      if (this.invoiceData != null) {
        for (let i = 0; i < this.invoiceData.items.length; i++) {
          this.filteredSelectedItems[i] = JSON.parse(JSON.stringify(res));
          this.filterSelectedItem();
        }
        this.filterSelectedItem();
      }
    });
  }

  saveAddress() {
    let url = ServerUrl.live + '/esim/saveShippingAddress';
    // let created = localStorage['userName'];
    // if (this.pagePermission.orderforcompany.value) {
    //   if (this.invoiceForm.controls['orderFor'].valid)
    //     created = this.invoiceForm.value.orderFor;
    // }

    let data = this.companies.filter(
      (value) => value.companyid == this.invoiceForm.value.orderFor
    );

    let userid = data[0].companyid;

    let body = {
      id: '',
      address: this.addressform.value.address,
      city: this.addressform.value.city,
      state: this.addressform.value.state,
      pincode: this.addressform.value.pincode,
      country: this.addressform.value.country,
      userid: userid,
      createdby: localStorage['userName'],
    };
    if (this.isAddressEdit) {
      body.id = this.addressId.toString();
    }
    this.ajaxService.ajaxPostWithBody(url, body).subscribe((res) => {
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
        if (this.pagePermission.orderforcompany.value) {
          this.getAddressFor({ value: this.invoiceForm.value.orderFor });
        } else {
          this.getAddress();
        }
        this.address = '';
        this.toggleModal();
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

  clearAll() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.invoiceForm.reset();
    this.invoiceForm.patchValue({
      deliveryDate: today,
    });
    this.filteredSelectedItems = [];
    this.minQuantity = [];
  }

  rateWithQuantity(e, form: FormGroup) {
    let rate = form['value'].rate;
    let quantity = form['value'].quantity;

    form.patchValue({
      amount: rate * quantity,
    });
  }

  modifyFilteredItems(value) {
    let deletedItem = this.items.filter((item) => item.id == value);
    if (deletedItem.length > 0) {
      this.filteredSelectedItems.map((items) => {
        if (!items.some((item) => item.id === deletedItem[0].id)) {
          items.push(deletedItem[0]);
        }
      });
    }
  }

  filterSelectedItem() {
    let arr = this.invoiceForm.get('invoiceFields') as FormArray;
    this.selectedItemsId = [];
    arr.value.map((selected) => {
      if (selected.item != null) {
        this.selectedItemsId.push(selected.item);
      }
    });
    this.filteredSelectedItems.map((arrayitem, index) => {
      arrayitem.map((item) => {
        if (
          this.selectedItemsId.includes(item?.id) &&
          this.selectedItemsId[index] != item.id
        ) {
          arrayitem.splice(arrayitem.indexOf(item), 1);
        }
      });
    });
  }

  setPrice(value, data: FormGroup, index) {
    this.filterSelectedItem();
    this.itemsData[index][1] = this.itemsData[index][0];
    this.itemsData[index][0] = value.value;
    this.modifyFilteredItems(this.itemsData[index][1]);
    let filteredItems = this.items.filter((d) => d.id == value.value);
    if (filteredItems.length > 0) {
      data.patchValue({
        quantity: filteredItems[0]['minorderqty'],
      });
      this.minQuantity[index] = filteredItems[0]['minorderqty'];
      data.patchValue({
        rate: parseFloat(filteredItems[0]['customerprice'].replace(/,/g, '')),
      });

      let rate = data['value'].rate;
      let quantity = data['value'].quantity;

      data.patchValue({
        amount: rate * quantity,
      });
    } else {
      data.patchValue({
        rate: 0.0,
      });
      data.patchValue({
        quantity: 0,
      });

      data.patchValue({
        amount: 0,
      });
    }
  }
  get capValues() {
    return this.invoiceForm.get('invoiceFields') as FormArray;
  }
  addRow() {
    this.filterSelectedItem();
    this.filteredSelectedItems.push(
      this.items.filter((item) => {
        for (let selectedID of this.selectedItemsId)
          if (selectedID == item.id) {
            return false;
          }
        return true;
      })
    );
    if (this.selectedItemsId.length == this.items.length) {
      this.messageService.add({
        key: 'toast1',
        severity: 'info',
        summary: 'Cannot add more lines than available list of products',
      });
    } else {
      let add = this.invoiceForm.get('invoiceFields') as FormArray;
      this.itemsData.push([]);
      add.push(
        this.formBuilder.group({
          id: [''],
          item: ['', Validators.required],
          quantity: [1, Validators.required],
          description: [null],
          rate: [0.0, Validators.required],
          amount: [0.0, Validators.required],
        })
      );
    }
  }

  ngOnInit() {
    this.company = localStorage.getItem('usertype');
    this.pagePermission = this.permission.getPermissionDetails(
      'Create Purchase Order'
    );
    this.getItems();
    this.getAddress();
    this.getCompanies();
    this.getDropdownData();
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.invoiceForm = this.formBuilder.group({
      address: [, Validators.required],
      deliveryDate: [
        today,
        Validators.compose([Validators.required, this.dateVaidators]),
      ],
      invoiceFields: this.formBuilder.array([
        this.formBuilder.group({
          id: [''],
          item: ['', Validators.required],
          description: [null],
          quantity: [1, Validators.required],
          rate: [0, Validators.required],
          amount: [0, Validators.required],
        }),
      ]),
    });
    this.addressform = this.formBuilder.group({
      address: [, Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
    });
    this.addressform.controls['state'].disable();
    this.addressform.controls['city'].disable();
    if (this.pagePermission.orderforcompany.value) {
      this.invoiceForm.addControl(
        'orderFor',
        new FormControl('', Validators.required)
      );
      let arr = this.invoiceForm.get('invoiceFields') as FormArray;
      let array = arr.controls[0] as FormGroup;
      array.controls['item'].disable();
    }
    this.itemsData.push([]);
    this.subscribe = this.capValues.valueChanges.subscribe((data) => {
      this.subtotal = data.reduce((a, b) => a + parseInt(b.amount), 0);
    });
    this.subscribe = this.capValues.valueChanges.subscribe((data) => {
      this.total = data.reduce((a, b) => a + parseInt(b.amount), 0);
    });

    this.payForm = this.formBuilder.group({
      date: [today, Validators.required],
      amount: [0, Validators.required],
    });

    this.invoiceData$ = this.store.select('invoiceData');
    this.invoiceData$.subscribe((val) => {
      this.invoiceData = val;
    });

    if (this.invoiceData != null) {
      console.log(this.invoiceData);
      this.submitButton = 'Edit Order';
      this.invoiceData = this.invoiceData[0];

      let dateReverseArr = this.invoiceData.date.split('-');
      let reversedDate = '';
      for (let i = dateReverseArr.length - 1; i >= 0; i--) {
        reversedDate += dateReverseArr[i] + '-';
      }
      reversedDate = reversedDate.slice(0, -1);
      let add = this.invoiceForm.get('invoiceFields') as FormArray;
      add.removeAt(0);

      if (this.pagePermission.orderforcompany.value) {
        this.invoiceForm.patchValue({
          orderFor: this.invoiceData.stockownerid,
        });
      }

      let url =
        ServerUrl.live +
        '/esim/getAllProductDetail?userId=' +
        localStorage['userName'];
      this.ajaxService.ajaxget(url).subscribe((res) => {
        this.itemsvalue = res;
        let data = this.itemsvalue.filter(
          (d) => d.productname == this.invoiceData.items[0].productname
        );
        this.checkqty = data[0].minorderqty;

        for (let i = 0; i < this.invoiceData.items.length; i++) {
          let items = this.invoiceData.items[i];
          this.minQuantity[i] = this.checkqty;
          this.itemsData[i] = [items.productid, undefined];
          add.push(
            this.formBuilder.group({
              id: [items.id],
              item: [items.productid.toString(), Validators.required],
              quantity: [items.quantity, Validators.required],
              description: [null],
              rate: [items.productprice, Validators.required],
              amount: [items.totalamount, Validators.required],
            })
          );
          this.getAddressFor({ value: this.invoiceData.email });
        }
      });
    }
  }
}
