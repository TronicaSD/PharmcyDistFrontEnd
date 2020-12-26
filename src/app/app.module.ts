import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

/***nebular Library */
import {
  NbSidebarModule
  , NbThemeModule,
  NbSidebarService,
  NbLayoutModule,
  NbMenuModule,
  NbCardModule
} from '@nebular/theme';

/***Components */

import { AuthService } from './auth/services/auth.service';
import { PublicService } from './Service/Public.Service/public-service.service';

@NgModule({
  declarations: [
    AppComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
