import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { Role } from '../shared/enums/roles';

import { AdminComponent } from './admin.component';
import { cityComponent } from './components/city/city.component';
import { GovernorateComponent } from './components/Governorate/Governorate.component';
import { doctorsComponent } from './components/doctors/doctors.component';
import { DrugsComponent } from './components/drugs/drugs.component';
import { ExpenseTypeComponent } from './components/expense-type/expense-type.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { PharmcyComponent } from './components/pharmcy/pharmcy.component';

const routes: Routes = [

  {
    path: '', component: AdminComponent,
    children: [
      { path: 'drugs', component: DrugsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },
      { path: 'pharmcies', component: PharmcyComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },
      { path: 'countries', component: GovernorateComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },
      { path: 'cities', component: cityComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },
      { path: 'doctors', component: doctorsComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },
      { path: 'ExpenseType', component: ExpenseTypeComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },
      { path: 'Expense', component: ExpenseComponent, canActivate: [AuthGuard], data: { roles: [Role.admin, Role.gm] } },

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
