import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {
  allStockDetails: any[];
  source: LocalDataSource = new LocalDataSource();
  currentLang: string;
  columnheaders: string[];
  settings: any;

  constructor(private _PublicService: PublicService
    , private translate: TranslateService
    , private _changeDetectorRef: ChangeDetectorRef) {

    this.currentLang = translate.currentLang;
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.getAllStockDetails();
    this.setColumnheaders();
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }
  setColumnheaders(): void {
    let DrugName = 'DrugName';
    let Quantity = 'Quantity';

    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get(DrugName).subscribe(label => this.columnheaders[0] = label);

    this.translate.get(Quantity).subscribe(label => {
      this.columnheaders[1] = label;
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
        },

        quantity: {
          title: this.columnheaders[1],
          type: 'string',
        filter: false

        },

      }
    };
  }
  getAllStockDetails() {
    this._PublicService.get("StockDetails/ViewGetAll").subscribe(res => {
      this.allStockDetails = res;
      this.source.load(this.allStockDetails);

    });
  }


}
