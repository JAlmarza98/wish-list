import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard, publicGuard } from '@auth/guards';

export const routes: Routes = [
  // TODO: crear guard
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes'), canActivate:[publicGuard] },
  { path: '\*\*', redirectTo: '', pathMatch: 'full' }
];
