import { Injectable } from '@angular/core';
import { AjaxService } from './ajax-service.service';
import { ServerUrl } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  loginData = [];

  constructor(private ajax: AjaxService) { }
  private pagePermissions: any;
  private availablePermissions = {};

  setData(d) {
    this.loginData = d;
  }
  filterPagePermission(data, component) {
    let permissions = [];
    data.filter((value) => {
      if (value.submenu) {
        let result = this.filterPagePermission(value.values, component);
        if (result.length > 0) {
          permissions = result;
        }
      }
      else if (value.header == component) {
        permissions.push(value);
      }
    });
    return permissions;
  }
  getPermissionDetails(component) {
    this.availablePermissions = {};
    let data = JSON.parse(localStorage['userPermission']);
    this.pagePermissions = this.filterPagePermission(data, component)[0].values;
    this.pagePermissions.forEach((element) => {
      let propertyName = '';
      propertyName = element.activity.replaceAll(' ', '');
      this.availablePermissions[propertyName.toLowerCase()] = element;
    });
    this.pagePermissions = this.availablePermissions;
    return this.pagePermissions;
  }
}
