import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFormatPipe } from './pipes/MomentFormatPipe';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DrugsComponent } from './components/drugs/drugs.component'
import { MenuChildrenComponent } from './components/shared/menu-children/menu-children.component';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbSidebarModule, NbSidebarService, NbThemeModule } from '@nebular/theme';
import { PublicService } from '../Service/Public.Service/public-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ToasterService } from '../Service/Toaster.Service/toaster.service';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';

class ToastrServiceThatThrows {
  constructor() { throw new Error('I should not be instantiated') }
}

@NgModule({
  declarations: [
    HomeComponent,
    DrugsComponent,
    MenuChildrenComponent,
    PharmcyComponent,
    StockDetailsComponent,
    SamplesComponent,
    InvoiceComponent,
    MomentFormatPipe
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
    NbEvaIconsModule,
    NbIconModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),

  ],
  exports: [
    MomentFormatPipe,

  ],
  providers: [{ provide: PublicService }, { provide: NbSidebarService }, { provide: ToastrService, useClass: ToastrServiceThatThrows }, { provide: AuthService }]
})
export class HomeModule {
}
