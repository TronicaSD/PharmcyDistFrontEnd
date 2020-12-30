import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DrugsComponent } from './components/drugs/drugs.component'
import { MenuChildrenComponent } from './components/shared/menu-children/menu-children.component';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbInputModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbSidebarModule, NbSidebarService, NbThemeModule } from '@nebular/theme';
import { PublicService } from '../Service/Public.Service/public-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ToasterService } from '../Service/Toaster.Service/toaster.service';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { NumbersOnlyDirective } from '../shared/directives/number-only.directive';

@NgModule({
  declarations: [
    HomeComponent,
    DrugsComponent,
    MenuChildrenComponent,
    PharmcyComponent,
    StockDetailsComponent,
    SamplesComponent,
    InvoiceComponent,
    NumbersOnlyDirective
    
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule.forRoot({ name: 'dark' }), // this will enable the default theme, you can change this to `cosmic` to enable the dark theme  
    NbMenuModule.forRoot(),
    NbCardModule,
    NgbModule,
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbDatepickerModule.forRoot(),
    NbDialogModule.forChild({closeOnBackdropClick:false,autoFocus:true,closeOnEsc:true})
    

  ],
  providers: [PublicService, NbSidebarService, ToasterService, AuthService]
})
export class HomeModule { }
