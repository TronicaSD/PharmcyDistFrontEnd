import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'cosmic' }), // this will enable the default theme, you can change this to `cosmic` to enable the dark theme  



  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
