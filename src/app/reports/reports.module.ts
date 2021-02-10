import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PublicService } from '../core/publicService.Service';
import { AuthService } from '../auth/services/auth.service';
import { AuthGuard } from '../auth/services/auth.guard';
import { NbLayoutDirectionService } from '@nebular/theme';
import { StockReportsComponent } from './components/stock-reports/stock-reports.component';
import { SalesReportsComponent } from './components/sales-reports/sales-reports.component';

@NgModule({
  declarations: [ReportsComponent,StockReportsComponent,SalesReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbEvaIconsModule,
  ],
  providers: [PublicService, AuthService, AuthGuard,NbLayoutDirectionService]
})
export class ReportsModule { }
