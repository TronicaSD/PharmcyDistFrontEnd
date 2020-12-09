import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing-module';
@NgModule({
  declarations: [
    // LoginComponent
  ],
  imports: [
    AuthRoutingModule,
  ],
  providers: [],
  bootstrap: []
})
export class AuthModule { }
