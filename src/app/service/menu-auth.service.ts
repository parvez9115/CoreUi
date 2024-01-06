import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuAuthService {
  constructor() { }

  menu: any = [];

  setMenu(d) {
    this.menu = d;
  }
  getMenu() {
    return this.menu;
  }
}
