import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import * as _ from 'lodash';
import { PublicService } from 'src/app/core/publicService.Service';

@Component({
  selector: 'app-stock-reports',
  templateUrl: './stock-reports.component.html',
  styleUrls: ['./stock-reports.component.css']
})
export class StockReportsComponent implements OnInit {
  allStockDetails: any[];
  chart: Chart;
  SeacrhForm: any;
  allStockDetailsForUser: any[];
  chartValuesForUser: any;
  chartColorsForUser: any;
  chartNamesForUser: any;

  constructor(private _PublicService: PublicService
    , private translate: TranslateService
    , private _formbuilder: FormBuilder

    , private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    let fromDate = new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), 1);

    this.SeacrhForm = this._formbuilder.group({
      from: [fromDate, Validators.required],
      to: [this.defaultDate, Validators.required],

    });
    this.getAllStockDetailsForChart();
  }
  defaultDate: Date = new Date();
  chartNames: any[] = [];
  chartValues: any[] = [];
  chartColors: any[] = [];
  AppendChart: any;
  chartHeaderForUsers = "All Stocks For All User";
  chartHeader = "All Stocks For Each User";

  getAllStockDetailsForChart() {
    this._PublicService.post("StockDetails/ViewGetAllForAll", this.SeacrhForm.value).subscribe(res => {
      res = _.orderBy(res, "quantity").reverse();
      this.allStockDetails = res;

      res.forEach(item => {

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
          text: this.chartHeaderForUsers
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

  // getAllStockDetailsForEachUserChart() {
  //   this._PublicService.get("StockDetails/ViewGetAllForChart").subscribe(res => {
  //     res = _.orderBy(res, "quantity").reverse();
  //     this.allStockDetailsForUser = res;
  //     debugger;
  //     res.forEach(Parentitem => {
  //       debugger;
  //       Parentitem.forEach(item => {
  //         debugger;
  //         this.chartNamesForUser.push(item.drug.drugName);
  //         this.chartValuesForUser.push(item.quantity);
  //         this.chartColorsForUser.push(this.generateColors());

  //       });

  //       this.generateBarChart();
  //     });
  //   });
  // }

  // generateBarChartEachUser() {
  //   this.chart = new Chart("chart", {
  //     type: 'bar',
  //     options: {
  //       animation: { duration: 1000, easing: 'linear' },
  //       tooltips: {
  //         enabled: true,
  //         mode: 'single',
  //         callbacks: {
  //           label: function (tooltipItems: any, data: any) {
  //             return data.datasets[0].data[tooltipItems.index];
  //           },
  //         },
  //       },
  //       title: {
  //         display: true,
  //         fontSize: 10,
  //         text: this.chartHeaderForUsers
  //       },
  //       scales: {
  //         xAxes: [
  //           {
  //             gridLines: {
  //               display: true
  //             },


  //           }
  //         ],

  //         yAxes: [
  //           {
  //             ticks: {
  //               beginAtZero: true,
  //               fontColor: "#000",
  //               fontSize: 10

  //             }
  //           }
  //         ]
  //       },
  //       legend: {
  //         align: "center",
  //         display: false
  //       }

  //     },

  //     data: {
  //       labels: this.chartNamesForUser.map(s => s.substring(0, 18)),


  //       datasets: [
  //         {
  //           data: this.chartValuesForUser,
  //           backgroundColor: this.chartColorsForUser,
  //           borderColor: "#fff",



  //         },

  //       ],


  //     },


  //   });
  // }
}
