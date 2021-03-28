import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import * as _ from 'lodash';
import { LocalDataSource } from 'ng2-smart-table';
import { PublicService } from 'src/app/core/publicService.Service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-stock-reports',
  templateUrl: './stock-reports.component.html',
  styleUrls: ['./stock-reports.component.css']
})
export class StockReportsComponent implements OnInit {
  allStockDetails: any[];
  chart: any;
  SeacrhForm: any;
  allStockDetailsForUser: any[];
  chartValuesForUser: any;
  chartColorsForUser: any;
  chartNamesForUser: any;
  UserList: any[];
  TotalDrugs: number;
  TotalCount: any;
  TotalUsers: number;
  TotalPriceInStock: number = 0;
  defaultDate: Date = new Date();
  chartNames: any[] = [];
  chartValues: any[] = [];
  chartColors: any[] = [];
  AppendChart: any;
  chartHeader = "";
  source: LocalDataSource = new LocalDataSource();

  currentLang: any;
  columnheaders: string[];
  settings: any;
  Drugs: any[];
  constructor(private _PublicService: PublicService
    , private translate: TranslateService
    , private _changeDetectorRef: ChangeDetectorRef
    , private _formbuilder: FormBuilder) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
      this.loadTableSettings();
    });

  }

  ngOnInit(): void {
    let fromDate = new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), 1);

    this.translate.get("StockDetails").subscribe(res => this.chartHeader = res);
    this.SeacrhForm = this._formbuilder.group({
      from: [fromDate, Validators.required],
      to: [new Date(), Validators.required],
      UserId: [""],

    });
    this.getAllStockDetailsForChart();
    this.GetAllUser();
    this.getAllDrugsTable()
    this.setColumnheaders();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });

  }

  setColumnheaders(): void {


    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get('Actions').subscribe(label => this.columnheaders[0] = label);
    this.translate.get('Name').subscribe(label => this.columnheaders[1] = label);
    this.translate.get('Price').subscribe(label => {
      this.columnheaders[2] = label;
      this.loadTableSettings();
    });

  }

  loadTableSettings() {
    this.settings = {
      pager: {
        display: true,
        perPage: 10,
        pagging: true,

      },

      hideSubHeader: false,
      actions: {
        position: "right",
        columnTitle: this.columnheaders[0],

        add: false,
        edit: false,
        delete: false,
      },

      columns: {

        drugName: {
          title: this.columnheaders[1],
          type: 'string',
          filter: true
        },
        price: {
          title: this.columnheaders[2],
          type: 'string',
          filter: false
        },
      }
    };
  }
  getAllStockDetailsForChart() {
    if (this.chart) {
      this.chart.destroy();

    }


    this.chartNames = [];
    this.chartValues = [];
    this.chartColors = [];


    if (this.SeacrhForm.value.from != null) {
      let date = new Date(Date.UTC(
        this.SeacrhForm.value.from.getFullYear(),
        this.SeacrhForm.value.from.getMonth(),
        this.SeacrhForm.value.from.getDate()
      ));
      this.SeacrhForm.controls.from.setValue(date);

    }


    if (this.SeacrhForm.value.to != null) {
      let date = new Date(Date.UTC(
        this.SeacrhForm.value.to.getFullYear(),
        this.SeacrhForm.value.to.getMonth(),
        this.SeacrhForm.value.to.getDate()
      ));
      this.SeacrhForm.controls.to.setValue(date);

    }



    this._PublicService.post("StockDetails/ViewGetAllForChart", this.SeacrhForm.value).subscribe(res => {
      res = _.orderBy(res, "quantity").reverse();
      this.allStockDetails = res;
      this.TotalCount = res.length;
      this.TotalPriceInStock = 0;
      let stockQty = [];
      res.forEach(item => {
        this.TotalPriceInStock += item.quantity * item.price;
        this.chartNames.push(item.drugName);
        this.chartValues.push(item.quantity);
        this.chartColors.push(this.generateColors());
        stockQty.push(item.quantity);
      });
      debugger;
      this.TotalDrugs = _.sum(stockQty);


      this.generateBarChart();
      this.getAllDrugsTable()
    });
  }
  generateColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')') as never;
  }
  generateBarChart() {
    this.chart = new Chart("Allchart", {
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
              ticks: {
                beginAtZero: true,
                fontColor: "#000",
                fontSize: 10.


              },
              gridLines: {
                display: false
              }

            }
          ],

          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "#000",
                fontSize: 10.


              },
              gridLines: {
                display: false
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


  //GetAllUser
  GetAllUser() {
    this._PublicService.get("User/GetAllAgents").subscribe((Response) => {
      this.UserList = Response;
      this.TotalUsers = Response.length;

    }, (error) => {
    });

  }
  // getAllDrugs() {

  //   this._PublicService.get("StockDetails/ViewGetAllByDrug").subscribe(res => {
  //     this.TotalDrugs = res.length;

  //   });
  // }

  getAllDrugsTable() {
    debugger;
    let userId = this.SeacrhForm.value.UserId
    this._PublicService.getByID("StockDetails/ViewGetAllByUser", userId).subscribe(res => {
      this.Drugs = res;
      debugger;
      this.source.load(this.Drugs);

    });
  }
  ClearFilter() {

    this.SeacrhForm.controls.from.setValue("");
    this.SeacrhForm.controls.to.setValue("");
    this.SeacrhForm.controls.UserId.setValue("");
    this.chart.destroy();
    this.chartNames = [];
    this.chartValues = [];
    this.chartColors = [];
    this.getAllStockDetailsForChart();
    this.getAllDrugsTable()

  }

  exportoExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */


    XLSX.writeFile(wb, "Drugs.xlsx");

  }
}
