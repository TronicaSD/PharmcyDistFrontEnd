import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFormatPipe } from './pipes/MomentFormatPipe';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DrugsComponent } from './components/drugs/drugs.component'
import { MenuChildrenComponent } from './components/shared/menu-children/menu-children.component';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbSidebarModule, NbSidebarService, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { PublicService } from '../Service/Public.Service/public-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NumbersOnlyDirective } from '../shared/directives/number-only.directive';

@NgModule({
  declarations: [
    HomeComponent,
    DrugsComponent,
    MenuChildrenComponent,
    NumbersOnlyDirective,
    PharmcyComponent,
    StockDetailsComponent,
    SamplesComponent,
    InvoiceComponent,
    MomentFormatPipe

  ],
  imports: [
    CommonModule,
    NbThemeModule.forRoot({ name: 'dark' }), // this will enable the default theme, you can change this to `cosmic` to enable the dark theme  

    HomeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbLayoutModule,
    NbSidebarModule,
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
    NbToastrModule.forRoot(),
    NbDialogModule.forChild({ closeOnBackdropClick: false, autoFocus: true, closeOnEsc: true })



  ],
  providers: [{ provide: PublicService }, { provide: NbSidebarService }
    , { provide: AuthService }]
})
export class HomeModule {
}
