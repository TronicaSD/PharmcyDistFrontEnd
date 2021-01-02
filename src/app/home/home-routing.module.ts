import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrugsComponent } from './components/drugs/drugs.component';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { AuthGuard } from '../../app/auth/services/auth.guard';
import { Role } from './enums/roles';

import { HomeComponent } from './home.component';

const routes: Routes = [

  {
    path: '', component: HomeComponent,
    children: [
      { path: 'drugs', component: DrugsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin] } },
      { path: 'pharmcies', component: PharmcyComponent, canActivate: [AuthGuard], data: { roles: [Role.admin] } },
      { path: 'stockDetails', component: StockDetailsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin] } },
      { path: 'Samples', component: SamplesComponent, canActivate: [AuthGuard], data: { roles: [Role.user] } },
      { path: 'Invoice', component: InvoiceComponent, canActivate: [AuthGuard], data: { roles: [Role.user] } },

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
