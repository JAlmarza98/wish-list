import { Routes } from '@angular/router';

const authRoute:Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'singup',
    loadComponent: () => import('./singin/singin.component').then(m => m.SinginComponent),
  },
  { path: '\*\*', redirectTo: 'login', pathMatch: 'full' }
];

export default authRoute;
