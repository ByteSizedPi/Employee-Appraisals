import { AppraisalListComponent } from './appraisal-list/appraisal-list.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuardService } from './auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SelfAppraisalComponent } from './main/self-appraisal/self-appraisal.component';
import { EmployeeAppraisalComponent } from './main/employee-appraisal/employee-appraisal.component';
import { OtherComponent } from './main/other/other.component';
import { LogoutComponent } from './logout/logout.component';
import { AccordionDirective } from './accordion.directive';
import { AppraisalComponent } from './main/appraisal/appraisal.component';
import { SummaryComponent } from './summary/summary.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { NewTemplateComponent } from './new-template/new-template.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    // path: 'main', canActivate: [AuthGuardService], component: MainComponent, children: [
    path: 'main', component: MainComponent, children: [
      { path: 'self', component: SelfAppraisalComponent },
      { path: 'employee', component: EmployeeAppraisalComponent },
      { path: 'other', component: OtherComponent },
    ]
  },
  { path: 'new', canActivate: [AuthGuardService], component: AppraisalComponent },
  { path: 'newEmployee', canActivate: [AuthGuardService], component: NewEmployeeComponent },
  { path: 'newTemplate', canActivate: [AuthGuardService], component: NewTemplateComponent },
  { path: 'appraisals', component: AppraisalListComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    SelfAppraisalComponent,
    EmployeeAppraisalComponent,
    OtherComponent,
    LogoutComponent,
    AccordionDirective,
    AppraisalComponent,
    SummaryComponent,
    NewEmployeeComponent,
    NewTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
