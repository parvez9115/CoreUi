import { Injectable } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class AgGridService {
  constructor() {}
  autoSizeColumns(gridApi, skipHeader = false) {
    console.log("Altered")
    let gridLength = gridApi.api.gridBodyCtrl.eGridBody.clientWidth;
    let gridContentLength =
      gridApi.api.gridBodyCtrl.eGridBody.children[0].children[1].children[0]
        .clientWidth;

    const allColumnIds: string[] = [];
    gridApi.columnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    gridApi.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    gridLength = gridApi.api.gridBodyCtrl.eGridBody.clientWidth;
    gridContentLength =
      gridApi.api.gridBodyCtrl.eGridBody.children[0].children[1].children[0]
        .clientWidth;

    if (gridLength > gridContentLength) {
      gridApi.api.sizeColumnsToFit();
    }
  }
  //Incase of fitting before data loads use setTimeout function ex:-setTimeout(() => { this.gridService.autoSizeColumns(this.gridApi); }, 0)
}
