import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [

  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },


  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },

  { path: '', redirectTo: 'auth', pathMatch: "full" },

  { path: '**', redirectTo: 'auth', pathMatch: "full" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
