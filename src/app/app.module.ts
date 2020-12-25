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
import { PublicService } from '../app/Service/Public.Service/public-service.service';
import { HomeComponent } from './Components/home/home.component';
import { SidebarRightComponent } from './Components/home/sidebar-right/sidebar-right.component';
import { DrugsComponent } from './Components/drugs/drugs.component';
import { MenuChildrenComponent } from './Components/home/menu-children/menu-children.component';
import { AuthService } from './auth/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarRightComponent,
    DrugsComponent,
    MenuChildrenComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule.forRoot({ name: 'default' }), // this will enable the default theme, you can change this to `cosmic` to enable the dark theme  
    NbMenuModule.forRoot(),
    NbCardModule,
  ],
  providers: [PublicService, NbSidebarService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
