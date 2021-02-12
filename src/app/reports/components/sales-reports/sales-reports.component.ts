import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as _ from 'lodash';
import { PublicService } from 'src/app/core/publicService.Service';
@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.css']
})
export class SalesReportsComponent implements OnInit {
  allInvoice: any[];
  chart: Chart;
  SeacrhForm: any;
  allInvoiceForUser: any[];
  chartValuesForUser: any;
  chartColorsForUser: any;
  chartNamesForUser: any;
  UserList: any[];
  TotalPriceAfterDiscount: number;
  TotalPrice: number;
  TotalPriceAfterDiscountList: any;
  TotalPriceList: any;
  TotalCount: _.Dictionary<number>;
  TotalDrugs: number;




  constructor(private _PublicService: PublicService
    , private translate: TranslateService
    , private _formbuilder: FormBuilder
    , public datepipe: DatePipe) { }


  ngOnInit(): void {
    let fromDate = new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), 1);

    this.SeacrhForm = this._formbuilder.group({
      from: ["", Validators.required],
      to: ["", Validators.required],
      UserId: [""],

    });
    this.getAllInvoiceForChart();
    this.GetAllUser();
    this.getAllDrugs();
  }
  defaultDate: Date = new Date();
  chartNames: any[] = [];
  chartValues: any[] = [];
  chartColors: any[] = [];
  AppendChart: any;
  chartHeader = "Sales";

  getAllInvoiceForChart() {

    if (this.SeacrhForm.value.UserId != "" || this.SeacrhForm.value.from != "" || this.SeacrhForm.value.to != "") {
      this.chartNames = [];
      this.chartValues = [];
      this.chartColors = [];
      this.chart.destroy();
    }
    this._PublicService.post("Invoice/ViewGetAllForChart", this.SeacrhForm.value).subscribe(res => {
      res = _.orderBy(res, "quantity").reverse();
      this.allInvoice = res;
      this.TotalPriceList = [];
      this.TotalPriceAfterDiscountList = [];


      debugger;
      res.forEach(item => {
        this.TotalPriceList.push(item.total);
        this.TotalPriceAfterDiscountList.push(item.totalAfterDiscount);
        this.chartNames.push(this.datepipe.transform(item.enteredDate, 'yyyy/MM/dd'));
        this.chartValues.push(item.total);
        this.chartColors.push(this.generateColors());
      });
      this.TotalPrice = _.sum(this.TotalPriceList);
      this.TotalCount = res.length;
      this.TotalPriceAfterDiscount = _.sum(this.TotalPriceAfterDiscountList);
      debugger;

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
    this.chart = new Chart("Invoicechart", {
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
    this._PublicService.get("User/ViewGetAll").subscribe((Response) => {
      this.UserList = Response;
      debugger;
    }, (error) => {
    });

  }
  getAllDrugs() {

    this._PublicService.get("Drugs/ViewGetAll").subscribe(res => {
      this.TotalDrugs = res.length;


    });
  }
}
