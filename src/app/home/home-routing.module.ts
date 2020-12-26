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
      { path: 'home/drugs', component: DrugsComponent },
      { path: 'home/pharmcies', component: PharmcyComponent },
      { path: 'home/stockDetails', component: StockDetailsComponent },
      { path: 'home/Samples', component: SamplesComponent },
      { path: 'home/Invoice', component: InvoiceComponent },
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
