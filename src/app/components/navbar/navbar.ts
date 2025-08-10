import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  currentUrl: string = '';
  constructor(public auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });
    this.currentUrl = this.router.url;
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout() {
    this.auth.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('subPermissions');
    localStorage.removeItem('subPermissions:timestamp');
    localStorage.removeItem('mainPermissions');
    localStorage.removeItem('mainPermissions:timestamp');

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
