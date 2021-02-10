import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css']
})
export class SmartTableComponent implements OnInit {
  @Input() data: any = [];
  @Input() headers: any[] = [];
  source: LocalDataSource = new LocalDataSource();

  settings: any = {
    actions: false,
    pager: {
      display: true,
      perPage: 20,
      pagging: true,
    },

    columns: {
    }

  }

  constructor() {

  }

  ceateTableHeaders() {
    this.headers.forEach(column => {
  
        this.settings.columns[column.name] = { title: column.title, filter: false };
    });
    this.source.load(this.data);
  }

  ngOnInit(): void {
    this.ceateTableHeaders();
  }

  onSearch(query: string = '') {
    let filterArr: any = [];
    this.headers.forEach(columnname => {
      filterArr.push({ field: columnname, search: query });

    });
    this.source.setFilter(filterArr, false);
  }

  exportoExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    


    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "Stocks.xlsx");

  }

}
