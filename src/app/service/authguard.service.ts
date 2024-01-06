import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GridPaginationService } from './grid-pagination.service';

@Injectable({
  providedIn: 'root',
})
export class AuthguardService {
  allowedMenu: [];
  menus = [];
  currentPage: string;
  otherPages = [
    '/register',
    '/login',
    '/invalid-page',
    '/setpassword/:primarymail',
    '/404',
    '/test/websocket',
    '/Home',
  ];
  constructor(private gridPagination:GridPaginationService) {}

  setMenu(menu) {
    this.allowedMenu = menu;
  }

  getMenus(menu: [] = []) {
    menu.forEach((element) => {
      if (Object.hasOwn(element, 'children')) {
        this.getMenus(element['children']);
      } else {
        this.menus.push(element['url']);
      }
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.gridPagination.resetPagination();
    this.menus = [];
    this.getMenus(this.allowedMenu)
    this.currentPage = state.url;
    let currentPage = localStorage['currentPage']
      ? localStorage['currentPage']
      : '{}';
    currentPage = JSON.parse(currentPage)?.currentPage;
    let index = 0;
    do {
      if (
        state.url == localStorage['initPage'] ||
        this.menus.includes(state.url) ||
        this.otherPages.includes(state.url) ||
        state.url == currentPage
      ) {
        localStorage['currentPage'] = JSON.stringify({
          currentPage: state.url,
        });
        return true;
      }
      index++;
    } while (index < (this.allowedMenu ? this.allowedMenu.length : 0));
    return false;
  }
}
