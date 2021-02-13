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
  chart: Chart = new Chart("barchart", {});
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

  constructor(private _PublicService: PublicService
    , private translate: TranslateService
    , private _formbuilder: FormBuilder) { }

  ngOnInit(): void {
    let fromDate = new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), 1);

    this.SeacrhForm = this._formbuilder.group({
      from: ["", Validators.required],
      to: ["", Validators.required],
      UserId: [""],

    });
    this.getAllStockDetailsForChart();
    this.GetAllUser();
    //  this.getAllDrugs();
  }
  defaultDate: Date = new Date();
  chartNames: any[] = [];
  chartValues: any[] = [];
  chartColors: any[] = [];
  AppendChart: any;
  chartHeaderForUsers = "All Stocks For All User";
  chartHeader = "All Stocks For Each User";

  getAllStockDetailsForChart() {

    this.chart.destroy();
    debugger;
    this.chartNames = [];
    this.chartValues = [];
    this.chartColors = [];
    if (this.SeacrhForm.value.UserId != "" || this.SeacrhForm.value.from != "" || this.SeacrhForm.value.to != "") {
      this.chart.destroy();
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
    }
    debugger;
    this._PublicService.post("StockDetails/ViewGetAllForChart", this.SeacrhForm.value).subscribe(res => {
      res = _.orderBy(res, "quantity").reverse();
      this.allStockDetails = res;
      this.TotalCount = res.length;
      this.TotalDrugs = res.length;
      this.TotalPriceInStock = 0;
      res.forEach(item => {
        this.TotalPriceInStock += item.quantity * item.price;
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
    this._PublicService.get("User/ViewGetAll").subscribe((Response) => {
      this.UserList = Response;
      this.TotalUsers = Response.length;

    }, (error) => {
    });

  }
  getAllDrugs() {

    this._PublicService.get("StockDetails/ViewGetAllByDrug").subscribe(res => {
      this.TotalDrugs = res.length;
    });
  }
  ClearFilter() {
    // this.SeacrhForm.reset();
    debugger;
    this.SeacrhForm.controls.from.setValue("");
    this.SeacrhForm.controls.to.setValue("");
    this.SeacrhForm.controls.UserId.setValue("");
    this.chart.destroy();
    this.chartNames = [];
    this.chartValues = [];
    this.chartColors = [];
    this.getAllStockDetailsForChart();
  }
}
