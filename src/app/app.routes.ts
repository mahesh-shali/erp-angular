import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/superAdmin/dashboard/dashboard';
import { AuthGuard } from './auth-guard';
import { Users } from './components/SuperAdmin/Masters/users/users';
import { Item } from './pages/superAdmin/item/item';
import { Index } from './pages/ai/index/index';
import { NotFound } from './pages/not-found/not-found';
import { LoggedInRedirectGuard } from './services/logged-in-redirect.guard';
import { UserRights } from './pages/superAdmin/user-rights/user-rights';

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
    path: 's/user-rights',
    component: UserRights,
    canActivate: [AuthGuard],
    data: { roles: [1] },
  },
  {
    path: 's/item',
    component: Item,
    canActivate: [AuthGuard],
    data: { roles: [1] },
  },
  {
    path: 's/ai',
    component: Index,
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

  { path: '404', component: NotFound },

  // { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: '',
    component: NotFound,
    canActivate: [LoggedInRedirectGuard],
    pathMatch: 'full',
  },
  { path: '**', component: NotFound, canActivate: [LoggedInRedirectGuard] },
  { path: '**', redirectTo: '/login' },
];
