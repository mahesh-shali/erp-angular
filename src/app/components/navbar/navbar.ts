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

  // onNavClick(section: string) {
  //   this.selectedSection = section;

  //   if (section.toLowerCase() === 'ai') {
  //     this.closeSubSidebar(); // ✅ clear submenu when AI clicked
  //     this.router.navigate(['s/ai']);
  //   } else if (section.toLowerCase() === 'home') {
  //     this.closeSubSidebar(); // ✅ Home also closes submenu
  //     this.router.navigate(['/home']);
  //   } else {
  //     this.menuService.setSelectedSection(section); // normal case
  //   }
  // }

  // closeSubSidebar() {
  //   this.menuService.setSelectedSection('');
  // }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout() {
    this.auth.logout();
    // localStorage.removeItem('token');
    // localStorage.removeItem('roleId');
    // localStorage.removeItem('subPermissions');
    // localStorage.removeItem('subPermissions:timestamp');
    // localStorage.removeItem('mainPermissions');
    // localStorage.removeItem('mainPermissions:timestamp');
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
