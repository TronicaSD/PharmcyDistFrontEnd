import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFormatPipe } from './pipes/MomentFormatPipe';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

import { PublicService } from '../core/publicService.Service';
import { AuthGuard } from '../auth/services/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { InventoryComponent } from './components/inventory/inventory.component';
import { NbLayoutDirectionService } from '@nebular/theme';
@NgModule({
  declarations: [
    HomeComponent,
    SamplesComponent,
    InvoiceComponent,
    MomentFormatPipe,
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


  ],

  providers: [PublicService, AuthService, AuthGuard,NbLayoutDirectionService]
})
export class HomeModule {
}

