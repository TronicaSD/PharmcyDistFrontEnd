import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';

const routes: Routes = [
// {path:'auth', loadChildren: () => import('./authentication/auth.module').then(m => m.AuthModule)},

{
  path: "auth",
  component: LoginComponent,

},
{path:'',redirectTo:'auth' ,pathMatch: "full"},
{path:'**',redirectTo:'auth' ,pathMatch: "full",},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
