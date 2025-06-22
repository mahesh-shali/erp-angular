import { Routes } from '@angular/router';
// Make sure the correct path and export are used for LoginComponent
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/superAdmin/dashboard/dashboard';
import { AuthGuard } from './auth-guard';
import { Users } from './components/SuperAdmin/Masters/users/users';
import { Overview } from './pages/superAdmin/overview/overview';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home },

  // Super Admin routes
  {
    path: 's/dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
    data: { roles: [1] },
  },
  {
    path: 's/users',
    component: Users,
    canActivate: [AuthGuard],
    data: { roles: [1] },
  },
  {
    path: 's/overview',
    component: Overview,
    canActivate: [AuthGuard],
    data: { roles: [1] },
  },

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
