import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GroupsViewComponent } from './pages/groups-view/groups-view.component';
import { authGuard, publicGuard } from '@auth/guards';
import { AddMemberComponent } from './pages/add-member/add-member.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'addMember/:id', component: AddMemberComponent, canActivate: [authGuard] },
  { path: 'group/:id', component: GroupsViewComponent, canActivate: [authGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes'), canActivate:[publicGuard] },
  { path: '\*\*', redirectTo: '', pathMatch: 'full' }
];
