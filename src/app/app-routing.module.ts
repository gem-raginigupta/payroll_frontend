import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import {PayrollComponent} from './payroll/payroll.component';
import  {InvestmentDeclarationComponent} from './investment-declaration/investment-declaration.component';
import { LoginComponent } from './account/login/login.component';
import { AuthGuard } from './core/authentication/auth.guard';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent,
  canActivate: [AuthGuard],
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
    {
      path: 'investmentDeclaration',
      component: InvestmentDeclarationComponent
    }
  ]
},
{
  path: 'login',
  component: LoginComponent
},
{ path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'},
  // { path: '**',
  //   component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
