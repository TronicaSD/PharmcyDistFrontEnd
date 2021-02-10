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
import { receiptDetailsComponent } from './components/receipt-details/receipt-details.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { NbLayoutDirectionService } from '@nebular/theme';

@NgModule({
  declarations: [AdminComponent,DrugsComponent,PharmcyComponent,receiptDetailsComponent,StockDetailsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbEvaIconsModule,
  ],
  providers: [PublicService, AuthService, AuthGuard,NbLayoutDirectionService]
})
export class AdminModule { }
