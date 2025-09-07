import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from './services/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as number[];
    const userRoleId = this.authService.getRoleId();

    if (allowedRoles && !allowedRoles.includes(userRoleId!)) {
      this.router.navigate(['/home']);
      return false;
    }

    if (!route.routeConfig) {
      return this.router.parseUrl('/404');
    }

    return true;
  }
}
