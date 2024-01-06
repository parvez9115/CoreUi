import { Injectable } from '@angular/core';
import { AjaxService } from './ajax-service.service';
import { ServerUrl } from 'src/environment';
import { timeStamp } from 'console';

@Injectable({
  providedIn: 'root'
})
export class GridPaginationService {
  currentPage = 0;
  totalRecords: any;
  totalPages: number;
  toRecord: number;
  searchTerm: string = '';
  isSearched: boolean;
  constructor(private ajaxService: AjaxService) { }

  resetPagination() {
    if (this.searchTerm != undefined || this.searchTerm != "") {
      this.currentPage = 0;
      this.totalRecords = undefined;
      this.totalPages = undefined;
      this.toRecord = undefined;
      this.searchTerm;
      this.isSearched = false;
    }
  }
  handlePagination(type) {
    if (this.searchTerm != undefined || this.searchTerm != '') {
      this.isSearched = true;
    }
    switch (type) {
      case 'first':
        this.currentPage = 0;
        break;
      case 'previous':
        if (this.currentPage > 0)
          this.currentPage--;
        break;
      case 'next':
        if (this.currentPage < this.totalPages)
          this.currentPage++;
        break;
      case 'last':
        this.currentPage = this.totalPages;
        break;
    }
    this.getToRecord();
  }

  getToRecord() {
    if (this.totalRecords < 100) {
      this.toRecord = this.totalRecords % 100;
    } else if (this.currentPage == this.totalPages) {
      this.toRecord = (this.currentPage * 100) + this.totalRecords % 100;
    } else {
      this.toRecord = (this.currentPage + 1) * 100;
    }
  }
  getTotalRecords(incomingurl) {
    let url = ServerUrl.live + incomingurl;
    this.ajaxService.ajaxget(url).subscribe(res => {
      this.totalRecords = res.TotalRecord;
      this.totalPages = parseInt((this.totalRecords / 100).toString());
      this.getToRecord();
    });
  }

  checkSearch(event) {
    console.log(event.target.value);
    if (event.target.value == undefined || event.target.value == '') {
      this.isSearched = false;
    }
  }
}
