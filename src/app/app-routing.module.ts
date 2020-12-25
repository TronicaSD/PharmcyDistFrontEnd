import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../app/Components/home/home.component';
import { DrugsComponent } from '../app/Components/drugs/drugs.component';


const routes: Routes = [

  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'Home', component: HomeComponent },
  { path: 'Drugs', component: DrugsComponent },

  { path: '', redirectTo: 'auth', pathMatch: "full" },

  { path: '**', redirectTo: 'auth', pathMatch: "full", },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
