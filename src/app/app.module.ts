import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbThemeModule } from '@nebular/theme';
import { AuthModule } from './authentication/auth.module';
import { LoginComponent } from './authentication/login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot({ name: 'dark' }),
 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
