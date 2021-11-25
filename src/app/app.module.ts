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
import { SafePipe } from './core/pipes/safepipe.pipe';
import { InvestmentDeclarationComponent } from './investment-declaration/investment-declaration.component';
import { LoginComponent } from './account/login/login.component';
import { GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig } from 'angularx-social-login';
import { AuthGuard } from './core/authentication/auth.guard';
import { AuthService } from './shared/services/auth.service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    EmployeeDetailsComponent,
    AddEmployeeDetailsComponent,
    PayrollComponent,
    LoginComponent,
    RemovewhitespacesPipe,
    FirstLetterToLowerCasePipe,
    ReplaceUnderscorePipe,
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
  providers: [
    AuthService, AuthGuard, SocialAuthService,
    {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            environment.clientId
          ),
        },
      ],
    } as SocialAuthServiceConfig,
  }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddEmployeeDetailsComponent]
})
export class AppModule { }
