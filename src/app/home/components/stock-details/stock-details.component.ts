import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Chart } from 'chart.js';
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
  chart: any;
  chartNames: any[] = [];
  chartValues: any[] = [];
  chartColors: any[] = [];
  chartHeader = " ";
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
  
    this.columnheaders = ['', '', '']
    this.translate.get('Stocks').subscribe(label => this.chartHeader = label);

    this.translate.get('DrugName').subscribe(label => this.columnheaders[0] = label);
    
    this.translate.get('Quantity').subscribe(label => {
      this.columnheaders[1] = label;
      this.loadTableSettings();
    });


  }
  loadTableSettings() {
    this.settings = {
     hideSubHeader: true,
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

        },

      }
    };
  }


  getAllStockDetails() {
    this._PublicService.get("StockDetails/ViewGetAll").subscribe(res => {
      res = _.orderBy(res, "quantity").reverse();
      this.allStockDetails = res;
      debugger;
      this.source.load(this.allStockDetails);

      res.forEach(item => {
        debugger;
        this.chartNames.push(item.drugName);
        this.chartValues.push(item.quantity);
        this.chartColors.push(this.generateColors());

      });
      this.generateBarChart();
    });
  }
  generateColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')') as never;
  }
  generateBarChart() {
    this.chart = new Chart("chart", {
      type: 'bar',
      options: {
        animation: { duration: 1000, easing: 'linear' },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItems: any, data: any) {
              return data.datasets[0].data[tooltipItems.index];
            },
          },
        },
        title: {
          display: true,
          fontSize: 10,
          text: this.chartHeader
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true
              },


            }
          ],

          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "#000",
                fontSize: 10

              }
            }
          ]
        },
        legend: {
          align: "center",
          display: false
        }

      },

      data: {
        labels: this.chartNames.map(s => s.substring(0, 18)),


        datasets: [
          {
            data: this.chartValues,
            backgroundColor: this.chartColors,
            borderColor: "#fff",



          },

        ],


      },


    });
  }
  exportoExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    ws['!cols'][3] = { hidden: true };


    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "Stocks.xlsx");

  }


}
