import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = 'sidebar';
  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);
  name: string;
  companyName: string;
  firstName;
  lastName;
  loginData: any;

  selectedMenu: any;
  header: string;

  constructor(
    private classToggler: ClassToggleService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    super();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSelectedMenu();
      }
    });
  }

  updateSelectedMenu() {
    const currentRoute = this.router.url;

    if (currentRoute === '/esim-company-creation') {
      this.header = 'Company Creation';
    } else if (currentRoute === '/esim-user') {
      this.header = 'Esim User';
    } else if (currentRoute === '/esim-change-password') {
      this.header = 'Esim Change Password';
    } else if (currentRoute === '/role-management') {
      this.header = 'Role Group';
    } else if (currentRoute === '/esim-product-details') {
      this.header = 'Product Details';
    } else if (currentRoute === '/esim-customer-price-mapping') {
      this.header = 'Customer Price Mapping';
    } else if (currentRoute === '/sales-order') {
      this.header = 'Create Purchase Order';
    } else if (currentRoute === '/sales-order-view') {
      this.header = 'View Purchase Order';
    } else if (currentRoute === '/esim-purchase-details') {
      this.header = 'Purchase Details';
    } else if (currentRoute === '/esim-assign-stocks') {
      this.header = 'Assign Stocks';
    } else if (currentRoute === '/sim-details-upload') {
      this.header = 'Sim Details Upload';
    } else if (currentRoute === '/esim-request-details') {
      this.header = 'Esim Request Details';
    } else if (currentRoute === '/esim-ca-request') {
      this.header = 'CA Request';
    } else if (currentRoute === '/esim-renewal-request') {
      this.header = 'Renewal Request';
    } else if (currentRoute === '/esim-topup-request') {
      this.header = 'Topup Request';
    } else if (currentRoute === '/esim-extend-validity-request') {
      this.header = 'Extend 1 Year Request';
    } else if (currentRoute === '/esim-dashboard') {
      this.header = 'Esim Dashboard';
    } else if (currentRoute === '/esim-activation') {
      this.header = 'Esim Activation History';
    } else if (currentRoute === '/esim-advance-payment') {
      this.header = 'Advance Payment';
    } else if (currentRoute === '/po-invoice') {
      this.header = 'PO Invoice';
    } else if (currentRoute === '/ca-invoice') {
      this.header = 'CA Invoice';
    } else if (currentRoute === '/renewal-invoice') {
      this.header = 'Renewal Invoice';
    } else if (currentRoute === '/topup-invoice') {
      this.header = 'Topup Invoice';
    } else if (currentRoute === '/extend-invoice') {
      this.header = 'Extend 1 Year Invoice';
    } else {
      this.header = '';
    }
  }

  changeMenu(menu: string) {
    this.selectedMenu = menu;
  }

  func() {
    console.log('Tryna leave');
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Logout?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.logout();
      },
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.firstName = this.loginData.firstname;
    this.firstName =
      this.firstName.charAt(0).toUpperCase() +
      this.firstName.slice(1).toLowerCase();

    this.lastName = this.loginData.lastname;
    this.lastName =
      this.lastName.charAt(0).toUpperCase() +
      this.lastName.slice(1).toLowerCase();

    this.companyName = this.loginData.companyname;
    this.companyName = this.companyName.toUpperCase();
  }
}

// import { Component, Input } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';

// import { ClassToggleService, HeaderComponent } from '@coreui/angular';
// import { ConfirmationService } from 'primeng/api';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';

// @Component({
//   selector: 'app-default-header',
//   templateUrl: './default-header.component.html',
// })
// export class DefaultHeaderComponent extends HeaderComponent {
//   @Input() sidebarId: string = 'sidebar';
//   public newMessages = new Array(4);
//   public newTasks = new Array(5);
//   public newNotifications = new Array(5);
//   name: string;
//   companyName: string;
//   firstName;
//   lastName;
//   loginData: any;

//   constructor(private classToggler: ClassToggleService, private confirmationService: ConfirmationService, private router: Router) {
//     super();
//   }

//   func() {
//     console.log('Tryna leave');
//     this.confirmationService.confirm({
//       message: 'Are you sure that you want to Logout?',
//       header: 'Logout Confirmation',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         this.logout();
//       },
//     });
//   }

//   logout() {
//     localStorage.clear();
//     this.router.navigateByUrl('/login');
//   }
// }
