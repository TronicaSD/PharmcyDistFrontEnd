import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DrugsComponent } from './components/drugs/drugs.component'
import { SidebarRightComponent } from './components/shared/sidebar-right/sidebar-right.component';
import { MenuChildrenComponent } from './components/shared/menu-children/menu-children.component';
import { NbCardModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbSidebarService, NbThemeModule } from '@nebular/theme';
import { PublicService } from '../Service/Public.Service/public-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';

@NgModule({
  declarations: [
    HomeComponent,
    DrugsComponent,
    HomeComponent,
    SidebarRightComponent,
    MenuChildrenComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule.forRoot({ name: 'default' }), // this will enable the default theme, you can change this to `cosmic` to enable the dark theme  
    NbMenuModule.forRoot(),
    NbCardModule,
  ],
  providers: [PublicService, NbSidebarService, AuthService]
})
export class HomeModule { }
