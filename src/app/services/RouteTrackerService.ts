import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteTrackerService {
  private lastRoute: string = '/home';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url !== '/404' && event.url !== '/login') {
          this.lastRoute = event.url;
          localStorage.setItem('lastRoute', this.lastRoute);
        }
      });
  }

  getLastRoute(): string {
    return localStorage.getItem('lastRoute') || this.lastRoute;
  }

  clearLastRoute() {
    localStorage.removeItem('lastRoute');
  }
}
