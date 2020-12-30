import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFormatPipe } from './pipes/MomentFormatPipe';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DrugsComponent } from './components/drugs/drugs.component'
import { MenuChildrenComponent } from './components/shared/menu-children/menu-children.component';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbSidebarModule, NbSidebarService, NbThemeModule } from '@nebular/theme';
import { PublicService } from '../Service/Public.Service/public-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { NumbersOnlyDirective } from '../shared/directives/number-only.directive';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    HomeComponent,
    MenuChildrenComponent,
    NumbersOnlyDirective,
  
    MomentFormatPipe
    
  ],
  imports: [
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
    NbIconModule,
    NbDatepickerModule.forRoot(),
    NbDialogModule.forChild({closeOnBackdropClick:false,autoFocus:true,closeOnEsc:true})
    


  ],
  exports: [
    MomentFormatPipe,

  ],
  providers: [{ provide: PublicService }, { provide: NbSidebarService },{ provide: AuthService }]
})
export class HomeModule {
}
