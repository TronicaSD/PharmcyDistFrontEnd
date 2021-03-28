import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { PublicService } from 'src/app/core/publicService.Service';
import { LocalDataSource } from 'ng2-smart-table';
@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.css']
})
export class SalesReportsComponent implements OnInit {
  allInvoice: any[];
  chart: any;
  SeacrhForm: any;
  allInvoiceForUser: any[];
  chartValuesForUser: any[] = [];
  chartColorsForUser: any;
  chartNamesForUser: any[] = [];
  userList: any[] = [];
  TotalPriceAfterDiscount: number;
  TotalPrice: number;
  TotalPriceAfterDiscountList: any;
  TotalPriceList: any;
  TotalDrugs: number;
  TotalPharmcies: any;
  allInvoiceForEachUser: any;
  chartForUser: Chart = new Chart("drugsChart", {});
  defaultDate: Date = new Date();
  chartNames: any[] = [];
  chartValues: any[] = [];
  chartColors: any[] = [];
  AppendChart: any;
  chartHeader = "Sales";
  currentLang: string;
  source: LocalDataSource = new LocalDataSource();
  columnheaders: string[];
  settings: any;
  Drugs: any;
  constructor(private _PublicService: PublicService
    , private translate: TranslateService
    , private _changeDetectorRef: ChangeDetectorRef
    , private _formbuilder: FormBuilder
    , public datepipe: DatePipe) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
      this.loadTableSettings();
    });

  }


  ngOnInit(): void {
    this.translate.get("SalesPerVendor").subscribe(res => this.chartHeader = res);

    let fromDate = new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), 1);

    this.SeacrhForm = this._formbuilder.group({
      from: [fromDate, Validators.required],
      to: [new Date(), Validators.required],
      UserId: [""],

    });
    this.getAllInvoiceForChart();

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
    this.translate.get('Quantity').subscribe(label => this.columnheaders[3] = label);
    this.translate.get('Total').subscribe(label => this.columnheaders[4] = label);
    this.translate.get('Price').subscribe(label => {
      this.columnheaders[5] = label;
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
          title: this.columnheaders[5],
          type: 'string',
          filter: false
        },
        quantity: {
          title: this.columnheaders[3],
          type: 'string',
          filter: false
        },
        total: {
          title: this.columnheaders[4],
          type: 'string',
          filter: false
        },
      }
    };
  }
  getAllInvoiceForChart() {
    if (this.chart) {
      this.chart.destroy();

    }
    this.chartNames = [];
    this.chartValues = [];
    this.chartColors = [];
    if (this.SeacrhForm.value.UserId != "") {

      this.getAllInvoiceForEachChart();
    }
    if (this.SeacrhForm.value.from != "") {
      let date = new Date(Date.UTC(
        this.SeacrhForm.value.from.getFullYear(),
        this.SeacrhForm.value.from.getMonth(),
        this.SeacrhForm.value.from.getDate()
      ));
      this.SeacrhForm.controls.from.setValue(date);

    }
    if (this.SeacrhForm.value.to != "") {
      let date = new Date(Date.UTC(
        this.SeacrhForm.value.to.getFullYear(),
        this.SeacrhForm.value.to.getMonth(),
        this.SeacrhForm.value.to.getDate()
      ));
      this.SeacrhForm.controls.to.setValue(date);

    }


    this._PublicService.post("Invoice/ViewGetAllForChart", this.SeacrhForm.value).subscribe(res => {
      res = _.orderBy(res, "quantity").reverse();
      this.allInvoice = res;
      this.TotalPriceList = [];
      this.TotalPriceAfterDiscountList = [];

      var resArr = [];
      res.forEach(function (item) {
        var i = resArr.findIndex(x => x.pharmcyId == item.pharmcyId);
        if (i <= -1) {
          resArr.push({ id: item.id, pharmcyId: item.pharmcyId });
        }
      });
      this.TotalPharmcies = resArr.length;

      res.forEach(item => {
        this.TotalPriceList.push(item.total);
        this.TotalPriceAfterDiscountList.push(item.totalAfterDiscount);
        this.chartNames.push(item.createdByName);
        this.chartValues.push(item.total);
        this.chartColors.push(this.generateColors());
      });
      this.TotalPrice = _.sum(this.TotalPriceList);
      this.TotalPriceAfterDiscount = _.sum(this.TotalPriceAfterDiscountList);

      this.generateBarChart();
      this.getAllDrugsTable();

    });
  }
  generateColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')') as never;
  }
  generateBarChart() {
    debugger;
    this.chart = new Chart("vendorchart", {
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


  //GetAllUser
  GetAllUser() {
    this._PublicService.get("User/GetAllAgents").subscribe((Response) => {
      this.userList = Response;
    }, (error) => {
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
    this.getAllInvoiceForChart();
    this.getAllDrugsTable();
  }
  //Chart ForEach User
  getAllInvoiceForEachChart() {
    this.chartNamesForUser = [];
    this.chartValuesForUser = [];
    this.chartColors = [];
    this.chartForUser.destroy();
    this._PublicService.post("Invoice/ViewGetEachUserForChart", this.SeacrhForm.value).subscribe(res => {
      this.allInvoiceForEachUser = res;
      res.forEach(item => {
        this.chartNamesForUser.push(item.drugName);
        this.chartValuesForUser.push(item.totalForDrug);
        this.chartColors.push(this.generateColors());
      });

      this.generateBaForUserChart();
    });
  }

  generateBaForUserChart() {
    this.chartForUser = new Chart("drugsChart", {
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
          text: 'sales per Total for each drug (Quantity * price)'
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
        labels: this.chartNamesForUser.map(s => s.substring(0, 18)),


        datasets: [
          {
            data: this.chartValuesForUser,
            backgroundColor: this.chartColors,
            borderColor: "#fff",



          },

        ],


      },


    });
  }
  getAllDrugsTable() {
    debugger;
    let userId = this.SeacrhForm.value.UserId
    this._PublicService.post("Invoice/ViewDrugInSalesPerUser", this.SeacrhForm.value).subscribe(res => {
      this.Drugs = res;
      debugger;
      this.source.load(this.Drugs);

    });
  }
  exportoExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */


    XLSX.writeFile(wb, "Sales.xlsx");

  }
}
