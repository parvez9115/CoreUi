import { Component, OnDestroy, OnInit } from '@angular/core';

import { navItems } from './_nav';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuAuthService } from '../../service/menu-auth.service';
import { AuthguardService } from 'src/app/service/authguard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  private navItems = JSON.parse(JSON.stringify(navItems));
  menuBuilder = [];
  menuArray = [];
  subMenuArray = [];
  loginData: any;
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
  constructor(
    public confirmationService: ConfirmationService,
    public router: Router,
    public menu: MenuAuthService,
    private authService: AuthguardService
  ) { }

  ngOnInit(): void {
    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    if (this.loginData != '') {
      let menu = JSON.parse(this.loginData.mainmenu);
      this.buildMenuArray(menu);
      let navItems = this.orderMenu(this.navItems, menu);
      this.buildMenu(navItems, this.menuArray);
      this.authService.setMenu(this.menuBuilder);
      localStorage.setItem('menu', JSON.stringify(this.menuBuilder));
    }
  }

  orderMenu(navItems, menu) {
    let pages = [];
    menu.map((page) => {
      let item = navItems.find((items) => items.name == page.header);
      if (item) pages.push(item);
    });
    return pages;
  }

  buildMenuArray(menu) {
    menu.map((d) => {
      if (d.submenu && d.value == true) {
        this.menuArray.push(d.header);
        this.buildMenuArray(d.values);
      } else if (d.value == true) {
        this.menuArray.push(d.header);
      }
    });
  }
  buildMenu(items, menuArray) {
    items.map((element) => {
      if (menuArray.includes(element.name)) {
        if (element.children) {
          let subMenuArray = [];
          element.children = this.buildsubMenu(
            element.children,
            menuArray,
            subMenuArray
          );
          if (element.children.length != 0) {
            this.menuBuilder.push(element);
          }
        } else {
          this.menuBuilder.push(element);
        }
      }
    });
  }
  buildsubMenu(item, menuArray, submenuArray) {
    if (Array.isArray(item)) {
      item.map((element) => {
        if (menuArray.includes(element.name)) {
          let subMenuArray = [];
          if (element.children) {
            element.children = this.buildsubMenu(
              element.children,
              menuArray,
              subMenuArray
            );
            if (element.children.length != 0) {
              submenuArray.push(element);
            }
          } else {
            submenuArray.push(element);
          }
        }
      });
    }
    return submenuArray;
  }

  func() {
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
    this.authService.setMenu([]);
    this.router.navigateByUrl('/login');
  }
}
