import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tabValue: number = 1;
  constructor() { }

  ngOnInit(): void {
  }
  ChangeTabValue(value) {
    this.tabValue = value;
  }
}
