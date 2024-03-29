import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbSpinnerModule, NbThemeModule }
  from '@nebular/theme';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { PublicService } from '../core/publicService.Service';


@NgModule({
  declarations: [LoginComponent],

  providers: [AuthService, CookieService,PublicService],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NbButtonModule,
    NbLayoutModule,
    NbInputModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    ReactiveFormsModule,
    NbFormFieldModule,
    NbEvaIconsModule,
    HttpClientModule,
    NbSpinnerModule
  ]
})
export class AuthModule { }
