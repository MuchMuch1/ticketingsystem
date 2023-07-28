import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomePageComponent } from './home-page/home-page.component';
import { CustomerPageComponent } from './customer-page/customer-page.component';
import { EmployeePageComponent } from './employee-page/employee-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'customer', component: CustomerPageComponent },
  { path: 'employee', component: EmployeePageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
