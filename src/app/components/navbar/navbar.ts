import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MenuService } from '../../services/menu.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  [x: string]: any;
  currentUrl: string = '';
  selectedSection: string = '';
  isMobileMenuOpen = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private menuService: MenuService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });
    this.currentUrl = this.router.url;
  }

  onAiClick() {
    this.uiService.triggerCloseSubsidenav();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isHomePage(): boolean {
    return this.router.url === '/home';
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleSidebar() {
    this.uiService.toggleSidebar();
  }

  logout() {
    this.auth.logout();
    const keysToRemove = [
      'token',
      'roleId',
      'subPermissions',
      'subPermissions:timestamp',
      'mainPermissions',
      'mainPermissions:timestamp',
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
