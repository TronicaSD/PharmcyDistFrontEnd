import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrugsComponent } from './components/drugs/drugs.component';

import { HomeComponent } from './home.component';

const routes: Routes = [

  {
    path: '', component: HomeComponent,
    children: [
      { path: 'home/drugs', component: DrugsComponent },


      { path: '', redirectTo: '' },

      { path: '**', redirectTo: '' },


    ]

  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
