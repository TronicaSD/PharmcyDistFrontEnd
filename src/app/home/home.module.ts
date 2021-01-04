import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFormatPipe } from './pipes/MomentFormatPipe';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DrugsComponent } from './components/drugs/drugs.component'
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

import { PublicService } from '../core/publicService.Service';
import { SharedModule } from '../shared/shared.module';
import { NbSidebarService, NbThemeModule, NbThemeService } from '@nebular/theme';



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
    HomeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NbThemeModule.forRoot({ name: "default" }),

    

 


  ],
  providers: [NbThemeService,NbThemeService,NbSidebarService,AuthService,PublicService  ],

})
export class HomeModule {
}
