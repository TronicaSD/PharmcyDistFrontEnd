import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';
import { receiptDetailsComponent } from '../home/components/receipt-details/receipt-details.component';
import { StockDetailsComponent } from '../home/components/stock-details/stock-details.component';

import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { AuthGuard } from '../../app/auth/services/auth.guard';
import { Role } from '../shared/enums/roles';

import { HomeComponent } from './home.component';

const routes: Routes = [

  {
    path: '', component: HomeComponent,
    children: [
      { path: 'Inventroy', component: InventoryComponent, canActivate: [AuthGuard], data: { roles: [Role.agent, Role.gm] } },
      { path: 'Samples', component: SamplesComponent, canActivate: [AuthGuard], data: { roles: [Role.agent, Role.gm] } },
      { path: 'Invoice', component: InvoiceComponent, canActivate: [AuthGuard], data: { roles: [Role.agent, Role.gm] } },
      { path: 'receiptDetails', component: receiptDetailsComponent, canActivate: [AuthGuard], data: { roles: [Role.agent, Role.gm] } },
      { path: 'StocktDetails', component: StockDetailsComponent, canActivate: [AuthGuard], data: { roles: [Role.agent, Role.gm] } },

    ]

  },

  { path: '', redirectTo: '' },
  { path: '**', redirectTo: '' },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {


}
