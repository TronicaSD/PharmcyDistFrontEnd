import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { Role } from '../shared/enums/roles';

import { AdminComponent } from './admin.component';
import { DrugsComponent } from './components/drugs/drugs.component';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';

const routes: Routes = [

  {
    path: '', component: AdminComponent,
    children: [
      { path: 'drugs', component: DrugsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },
      { path: 'pharmcies', component: PharmcyComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },
    

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
