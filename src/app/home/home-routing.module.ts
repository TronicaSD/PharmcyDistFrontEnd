import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrugsComponent } from './components/drugs/drugs.component';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

import { HomeComponent } from './home.component';

const routes: Routes = [
 
   {
    path: '', component: HomeComponent,
    children: [
      { path: 'drugs', component: DrugsComponent },
      { path: 'pharmcies', component: PharmcyComponent },
      { path: 'stockDetails', component: StockDetailsComponent },
      { path: 'Samples', component: SamplesComponent },
      { path: 'Invoice', component: InvoiceComponent },
    
    ]

  },
  { path: '', redirectTo: '' },
  { path: '**', redirectTo: '' },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
