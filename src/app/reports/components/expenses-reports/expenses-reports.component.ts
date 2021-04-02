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
  selector: 'app-expenses-reports',
  templateUrl: './expenses-reports.component.html',
  styleUrls: ['./expenses-reports.component.css']
})
export class expensesReportsComponent implements OnInit {
  allExpense: any[];
  chart: any;
  SeacrhForm: any;
  allExpenseForUser: any[];
  chartValuesForUser: any[] = [];
  chartColorsForUser: any;
  chartNamesForUser: any[] = [];
  userList: any[] = [];
  amountPriceAfterDiscount: number;
  amountPrice: number;
  amountPriceList: any;
  amountDrugs: number;
  allExpenseForEachUser: any;
  chartForUser: Chart = new Chart("drugsChart", {});
  defaultDate: Date = new Date();
  chartNames: any[] = [];
  chartValues: any[] = [];
  chartColors: any[] = [];
  AppendChart: any;
  chartHeader = "expenses";
  currentLang: string;
  source: LocalDataSource = new LocalDataSource();
  columnheaders: string[];
  settings: any;
  Drugs: any;
  allExpenseType: any;
  chartNamesForExpenseType: any[] = [];
  chartValuesForExpenseType: any[] = [];
  chartHeaderForExpenseType: any;
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
    this.translate.get("Users").subscribe(res => this.chartHeader = res);
    this.translate.get("Expenses").subscribe(res => this.chartHeaderForExpenseType = res);

    let fromDate = new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), 1);

    this.SeacrhForm = this._formbuilder.group({
      from: [fromDate, Validators.required],
      to: [new Date(), Validators.required],
      UserId: [""],

    });
    this.getAllExpenseForChart();
    this.getAllExpenseForChartForExpenseType();
    this.GetAllUser();
    this.getAllForTable()
    this.setColumnheaders();
    //LISTEN TO EVENTS
    this.translate.onLangChange.subscribe(item => {
      this.setColumnheaders();
    });
  }

  setColumnheaders(): void {


    this.columnheaders = ['', '', '']
    //Used TranslateService from @ngx-translate/core
    this.translate.get('UserName').subscribe(label => this.columnheaders[0] = label);
    this.translate.get('ExpenseType').subscribe(label => this.columnheaders[1] = label);
    this.translate.get('Total').subscribe(label => {
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

        userName: {
          title: this.columnheaders[0],
          type: 'string',
          filter: true
        },
        expensesName: {
          title: this.columnheaders[1],
          type: 'string',
          filter: false
        },
        amount: {
          title: this.columnheaders[2],
          type: 'string',
          filter: false
        },

      }
    };
  }
  getAllExpenseForChartForExpenseType() {
    if (this.chart) {
      this.chart.destroy();

    }
    this.chartNamesForExpenseType = [];
    this.chartValuesForExpenseType = [];
    if (this.SeacrhForm.value.UserId != "") {

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


    this._PublicService.post("Expense/ViewGetChartForExpenseType", this.SeacrhForm.value).subscribe(res => {
      this.allExpenseType = res;

      res.forEach(item => {
        this.chartNamesForExpenseType.push(item.expensesName);
        this.chartValuesForExpenseType.push(item.amount);
        this.chartColors.push(this.generateColors());
      });

      this.generateBarChartForExpenseType();

    });
  }

  getAllExpenseForChart() {
    if (this.chart) {
      this.chart.destroy();

    }
    this.chartNames = [];
    this.chartValues = [];
    this.chartColors = [];

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


    this._PublicService.post("Expense/ViewGetChartForUser", this.SeacrhForm.value).subscribe(res => {
      this.allExpense = res;
      this.amountPriceList = [];

      var resArr = [];
      res.forEach(function (item) {
        var i = resArr.findIndex(x => x.pharmcyId == item.pharmcyId);
        if (i <= -1) {
          resArr.push({ id: item.id, pharmcyId: item.pharmcyId });
        }
      });

      res.forEach(item => {
        this.amountPriceList.push(item.amount);
        this.chartNames.push(item.userName);
        this.chartValues.push(item.amount);
        this.chartColors.push(this.generateColors());
      });
      this.amountPrice = _.sum(this.amountPriceList);

      this.generateBarChart();
      this.getAllForTable();

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
    this.chart = new Chart("userchart", {
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


  generateBarChartForExpenseType() {
    debugger;
    this.chart = new Chart("Expensetypechart", {
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
          text: this.chartHeaderForExpenseType
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
        labels: this.chartNamesForExpenseType.map(s => s.substring(0, 18)),


        datasets: [
          {
            data: this.chartValuesForExpenseType,
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
    this.getAllExpenseForChart();
    this.getAllExpenseForChartForExpenseType
    this.getAllForTable();
  }



  getAllForTable() {
    debugger;
    let userId = this.SeacrhForm.value.UserId
    this._PublicService.post("Expense/ViewGetChartForUserAndExpenseType", this.SeacrhForm.value).subscribe(res => {
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


    XLSX.writeFile(wb, "expenses.xlsx");

  }
}
