import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { Role } from '../shared/enums/roles';

import { AdminComponent } from './admin.component';
import { DrugsComponent } from './components/drugs/drugs.component';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';
import { receiptDetailsComponent } from './components/receipt-details/receipt-details.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';

const routes: Routes = [

  {
    path: '', component: AdminComponent,
    children: [
      { path: 'drugs', component: DrugsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin] } },
      { path: 'pharmcies', component: PharmcyComponent, canActivate: [AuthGuard], data: { roles: [Role.admin] } },
      { path: 'receiptDetails', component: receiptDetailsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin] } },
      { path: 'StocktDetails', component: StockDetailsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin] } },

    ]

  },

  { path: '', redirectTo: '' },
  { path: '**', redirectTo: '' },



];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
