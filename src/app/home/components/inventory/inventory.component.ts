import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  allStockDetails: any[];
  source: LocalDataSource = new LocalDataSource();
  currentLang: string;
  columnheaders: string[];
  settings: any;
  SeacrhForm: any;

  constructor(private _PublicService: PublicService
    , private translate: TranslateService
    , private _formbuilder: FormBuilder

    , private _changeDetectorRef: ChangeDetectorRef) {
    this.SeacrhForm = this._formbuilder.group({
      from: [null, Validators.required],
      to: [null, Validators.required],

    });
    this.currentLang = translate.currentLang;
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.getAllInventory();
    this.setColumnheaders();
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
    let DrugName = 'DrugName';
    let quantityInStock = 'Stock';
    let QuantityInSample = 'Samples';
    let QuantityInInvoice = 'Invoices';
    let Total = 'Total';

    this.columnheaders = ['', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get(DrugName).subscribe(label => this.columnheaders[0] = label);
    this.translate.get(QuantityInSample).subscribe(label => this.columnheaders[1] = label);
    this.translate.get(QuantityInInvoice).subscribe(label => this.columnheaders[2] = label);
    this.translate.get(quantityInStock).subscribe(label => this.columnheaders[3] = label);

    this.translate.get(Total).subscribe(label => {
      this.columnheaders[4] = label;
      this.loadTableSettings();
    });

  }
  loadTableSettings() {
    this.settings = {
      // hideSubHeader: true,
      actions: {
        position: "right",
        columnTitle: this.columnheaders[0],

        add: false,
        edit: false,
        delete: false,
      },

      columns: {
        drugName: {
          title: this.columnheaders[0],
          type: 'string',
          filter:true,

        }
        , quantityInSample: {
          title: this.columnheaders[1],
          type: 'string',
          filter:false

        },
        quantityInInvoice: {
          title: this.columnheaders[2],
          type: 'string',
          filter:false

        },
        quantityInStock: {
          title: this.columnheaders[3],
          type: 'string',
          filter:false
        },
        total: {
          title: this.columnheaders[4],
          type: 'string',
          filter:false


        },
      }
    };
  }

  getAllInventory() {
   
    //  this.SeacrhForm.value.from = new Date(this.SeacrhForm.value.from.getUTCDate());
   

    this._PublicService.post("StockDetails/ViewInventoey", this.SeacrhForm.value).subscribe(res => {
      this.allStockDetails = res;
      this.source.load(this.allStockDetails);

    });
  }
  exportoExcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    ws['!cols'][3] = { hidden: true };
    
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, "Stocks.xlsx");
 
  }

}
