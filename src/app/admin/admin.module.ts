import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PublicService } from '../core/publicService.Service';
import { AuthService } from '../auth/services/auth.service';
import { AuthGuard } from '../auth/services/auth.guard';
import { TranslateModule } from '@ngx-translate/core';
import { DrugsComponent } from './components/drugs/drugs.component';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { receiptDetailsComponent } from '../home/components/receipt-details/receipt-details.component';
import { StockDetailsComponent } from '../home/components/stock-details/stock-details.component';
import { NbLayoutDirectionService } from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { countryComponent } from './components/country/country.component';
import { cityComponent } from './components/city/city.component';
import { doctorsComponent } from './components/doctors/doctors.component';
import { ExpenseTypeComponent } from './components/expense-type/expense-type.component';
import { ExpenseComponent } from './components/expense/expense.component';
@NgModule({
  declarations: [AdminComponent, DrugsComponent, PharmcyComponent,
    receiptDetailsComponent,
    StockDetailsComponent, countryComponent,
    cityComponent, doctorsComponent, ExpenseTypeComponent, ExpenseComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbEvaIconsModule,
    ChartsModule,

  ],
  providers: [PublicService, AuthService, AuthGuard, NbLayoutDirectionService]
})
export class AdminModule { }
