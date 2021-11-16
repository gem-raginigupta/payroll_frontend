import { PayrollComponent } from './payroll/payroll.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { AddEmployeeDetailsComponent } from './add-employee-details/add-employee-details.component';
import { HttpClientModule } from '@angular/common/http';
import { RemovewhitespacesPipe } from './core/pipes/removeWHiteSpaces.pipe';
import { FirstLetterToLowerCasePipe } from './core/pipes/firstLetterToLowerCase.pipe';
import { ReplaceUnderscorePipe } from './core/pipes/replaceUnderscore.pipe';
import { DndDirective } from './employee-details/dnd.directive';
import { ProgressComponent } from './employee-details/progress/progress.component';
import { SafePipe } from './core/pipes/safepipe.pipe';
import { InvestmentDeclarationComponent } from './investment-declaration/investment-declaration.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    EmployeeDetailsComponent,
    AddEmployeeDetailsComponent,
    PayrollComponent,
    RemovewhitespacesPipe,
    FirstLetterToLowerCasePipe,
    ReplaceUnderscorePipe,
    DndDirective,
    ProgressComponent,
    SafePipe,
    InvestmentDeclarationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AddEmployeeDetailsComponent]
})
export class AppModule { }
