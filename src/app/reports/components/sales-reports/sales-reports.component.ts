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
  chart: any ;
  SeacrhForm: any;
  allInvoiceForUser: any[];
  chartValuesForUser: any[] = [];
  chartColorsForUser: any;
  chartNamesForUser: any[] = [];
  userList: any[]=[];
  TotalPriceAfterDiscount: number;
  TotalPrice: number;
  TotalPriceAfterDiscountList: any;
  TotalPriceList: any;
  TotalDrugs: number;
  TotalPharmcies: any;
  allInvoiceForEachUser: any;
  chartForUser: any;



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
  }
  defaultDate: Date = new Date();
  chartNames: any[] = [];
  chartValues: any[] = [];
  chartColors: any[] = [];
  AppendChart: any;
  chartHeader = "Sales";

  getAllInvoiceForChart() {
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
          text: 'Sales Per Vendor'
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
  }
  //Chart ForEach User
  getAllInvoiceForEachChart() {
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
          text: 'sales per drug'
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

}
