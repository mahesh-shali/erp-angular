import { Routes } from '@angular/router';
// Make sure the correct path and export are used for LoginComponent
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
