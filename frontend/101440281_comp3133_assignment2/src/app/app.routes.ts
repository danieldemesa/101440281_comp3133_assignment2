import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';

export const routes: Routes = [
  // Default route redirects to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Employee routes
  { path: 'employees', component: EmployeeListComponent },
  { path: 'add-employee', component: AddEmployeeComponent },

  // Lazy-loaded standalone routes
  {
    path: 'view-employee/:id',
    loadComponent: () =>
      import('./employee/view-employee.component').then(m => m.ViewEmployeeComponent)
  },
  {
    path: 'update-employee/:id',
    loadComponent: () =>
      import('./employee/update-employee.component').then(m => m.UpdateEmployeeComponent)
  }
];
