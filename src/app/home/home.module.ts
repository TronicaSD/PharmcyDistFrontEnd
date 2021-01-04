import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFormatPipe } from './pipes/MomentFormatPipe';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DrugsComponent } from './components/drugs/drugs.component'
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

import { PublicService } from '../core/publicService.Service';
import { AuthGuard } from '../auth/services/auth.guard';
import {  NbThemeModule } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    DrugsComponent,
    PharmcyComponent,
    StockDetailsComponent,
    SamplesComponent,
    InvoiceComponent,
    MomentFormatPipe,
 


  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbThemeModule.forRoot({ name: "dark" }),
    
  ],
  providers: [PublicService , AuthService ,AuthGuard ]
})
export class HomeModule {
}
