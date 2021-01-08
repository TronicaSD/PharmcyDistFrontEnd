import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFormatPipe } from './pipes/MomentFormatPipe';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DrugsComponent } from './components/drugs/drugs.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { receiptDetailsComponent } from './components/receipt-details/receipt-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

import { PublicService } from '../core/publicService.Service';
import { AuthGuard } from '../auth/services/auth.guard';
import { NbThemeModule } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { InventoryComponent } from './components/inventory/inventory.component';

@NgModule({
  declarations: [
    HomeComponent,
    DrugsComponent,
    PharmcyComponent,
    receiptDetailsComponent,
    SamplesComponent,
    InvoiceComponent,
    MomentFormatPipe,
    StockDetailsComponent,
    InventoryComponent,



  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbEvaIconsModule,
    NbThemeModule.forRoot({ name: "default" }),


  ],
  exports: [TranslateModule],

  providers: [PublicService, AuthService, AuthGuard]
})
export class HomeModule {
}

