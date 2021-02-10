import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';

import { SamplesComponent } from './components/samples/samples.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { AuthGuard } from '../../app/auth/services/auth.guard';
import { Role } from '../shared/enums/roles';

import { HomeComponent } from './home.component';

const routes: Routes = [

  {
    path: '', component: HomeComponent,
    children: [
      { path: 'Inventroy', component: InventoryComponent, canActivate: [AuthGuard], data: { roles: [Role.admin] } },
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
export class HomeRoutingModule {


}
