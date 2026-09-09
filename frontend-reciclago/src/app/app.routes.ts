import { Routes } from '@angular/router';
import { MsalRedirectComponent } from '@azure/msal-angular';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'pickups',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'catalog',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'audit',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    component: MsalRedirectComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
