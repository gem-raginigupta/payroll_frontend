import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import {PayrollComponent} from './payroll/payroll.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent,
  children: [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'empDetails',
      component: EmployeeDetailsComponent
    },
    {
      path: 'payroll',
      component: PayrollComponent
    },
  ]
},
{ path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'},
  // { path: '**',
  //   component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
