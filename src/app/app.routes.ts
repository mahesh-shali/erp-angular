import { Routes } from '@angular/router';
// Make sure the correct path and export are used for LoginComponent
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/superAdmin/dashboard/dashboard';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home },

  // Super Admin routes
  { path: 's/dashboard', component: Dashboard, canActivate: [AuthGuard] },

  // Admin routes
  {
    path: 'a/dashboard',
    loadComponent: () =>
      import('./pages/admin/admin-dashboard/admin-dashboard').then(
        (m) => m.AdminDashboard
      ),
    canActivate: [AuthGuard],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
