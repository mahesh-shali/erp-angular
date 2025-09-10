// import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { SidebarItem } from '../../constants/constants';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { HttpClient } from '@angular/common/http';

// import { AuthService } from '../../services/auth';
// import { MenuService } from '../../services/menu.service';
// import { UiService } from '../../services/ui.service';
// import { Subscription } from 'rxjs/internal/Subscription';
// // import { environment } from '../../../environments/environment';
// import { environment } from 'src/environments/environment.prod';

// @Component({
//   selector: 'app-sidenavbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MatIconModule],
//   templateUrl: './sidenavbar.html',
//   styleUrl: './sidenavbar.scss',
// })
// export class Sidenavbar implements OnInit {
//   navItems: SidebarItem[] = [];
//   selectedSection: string | null = null;
//   private sub!: Subscription;

//   @Output() sectionSelected = new EventEmitter<string>();

//   private apiUrl = environment.apiUrl;

//   constructor(
//     private http: HttpClient,
//     private auth: AuthService,
//     private menuService: MenuService,
//     private router: Router,
//     private uiService: UiService
//   ) {
//     this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
//       this.selectedSection = null; // collapse subsidenav
//     });
//   }

//   isLoginPage(): boolean {
//     return this.router.url === '/login';
//   }
//   ngOnInit(): void {
//     this.auth.loginState$.subscribe((roleId) => {
//       if (roleId) {
//         this.loadMenu(roleId);
//       } else {
//         this.navItems = [];
//       }
//     });
//   }

//   private loadMenu(roleId: number) {
//     const cache = localStorage.getItem('mainPermissions');
//     const timestamp = localStorage.getItem('mainPermissions:timestamp');
//     const token = localStorage.getItem('token');
//     const FIVE_SECONDS = 5 * 1000;
//     const now = Date.now();

//     if (cache && timestamp && now - parseInt(timestamp) < FIVE_SECONDS) {
//       this.navItems = JSON.parse(cache).filter(
//         (item: SidebarItem) => item.isvisible
//       );
//     } else {
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
//       this.http
//         .get<any>(`${this.apiUrl}/auth/permissions/${roleId}`)
//         .subscribe({
//           next: (data) => {
//             const mainPermissions = data.mainPermissions || [];

//             localStorage.setItem(
//               'mainPermissions',
//               JSON.stringify(mainPermissions)
//             );
//             localStorage.setItem('mainPermissions:timestamp', now.toString());

//             this.navItems = mainPermissions.filter(
//               (item: SidebarItem) => item.isvisible
//             );
//           },
//           error: (err) => console.error('Error loading nav items', err),
//         });
//     }
//   }

//   selectSection(section: string) {
//     this.selectedSection = section;
//     this.sectionSelected.emit(section);
//     if (section.toLowerCase() === 'dashboard') {
//       this.router.navigate(['s/dashboard']);
//       return;
//     }
//     if (section.toLowerCase() === 'ai') {
//       this.menuService.setSelectedSection(''); // ✅ close submenu
//       this.router.navigate(['s/ai']);
//       return;
//     }
//     this.menuService.setSelectedSection(section);
//     this.selectedSection = section;
//   }

//   ngOnDestroy() {
//     this.sub.unsubscribe();
//   }
// }

import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { SidebarItem } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../services/auth';
import { MenuService } from '../../services/menu.service';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PermissionsService } from '../../services/permissions.service';

interface PermissionsResponse {
  mainPermissions: SidebarItem[];
  subPermissions?: any[];
}

@Component({
  selector: 'app-sidenavbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidenavbar.html',
  styleUrls: ['./sidenavbar.scss'], // fixed typo from styleUrl -> styleUrls
})
export class Sidenavbar implements OnInit, OnDestroy {
  navItems: SidebarItem[] = [];
  selectedSection: string | null = null;
  private sub!: Subscription;
  mobileAccordionOpen = false;

  optionsForCurrentSection: Array<{
    label?: string;
    option: string;
    route: string;
    isvisible: boolean;
    icon?: string;
  }> = [];

  @Output() sectionSelected = new EventEmitter<string>();

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private menuService: MenuService,
    private router: Router,
    public uiService: UiService,
    private permissionsService: PermissionsService
  ) {
    this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
      this.selectedSection = null; // collapse subsidenav
    });
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit(): void {
    this.auth.loginState$.subscribe((roleId) => {
      if (roleId) {
        this.loadMenu(roleId);
        const token = localStorage.getItem('token') || '';
        this.permissionsService.startPolling(roleId, token);
      } else {
        this.navItems = [];
        this.permissionsService.stopPolling();
      }
    });
  }

  private loadMenu(roleId: number) {
    const cache = localStorage.getItem('mainPermissions');
    if (cache) {
      try {
        const cached = JSON.parse(cache) as SidebarItem[];
        this.navItems = cached.filter((item: SidebarItem) => item.isvisible);
        return;
      } catch {}
    }

    // If no cache yet, subscribe once to the permissions stream for the first value
    const sub = this.permissionsService.mainPermissions$.subscribe((list) => {
      if (list && list.length) {
        this.navItems = list.filter((item: SidebarItem) => item.isvisible);
        sub.unsubscribe();
      }
    });
  }

  selectSection(section: string) {
    const normalized = section.toLowerCase();

    // Special handling for Dashboard: never open mobile submenu/accordion
    if (normalized === 'dashboard') {
      this.selectedSection = section;
      this.mobileAccordionOpen = false; // ensure accordion is closed
      this.optionsForCurrentSection = []; // clear any prior submenu options
      this.menuService.setSelectedSection(''); // collapse subsidenav state
      this.sectionSelected.emit(section);
      this.router.navigate(['s/dashboard']);
      return;
    }

    // Toggle mobile accordion when the same non-dashboard section is clicked; otherwise open and load
    if (this.selectedSection === section) {
      this.mobileAccordionOpen = !this.mobileAccordionOpen;
    } else {
      this.selectedSection = section;
      this.mobileAccordionOpen = true;
    }

    this.sectionSelected.emit(section);

    if (normalized === 'ai') {
      this.menuService.setSelectedSection('');
      this.router.navigate(['s/ai']);
      return;
    }

    this.menuService.setSelectedSection(section);
    // Load submenu options for accordion (mobile)
    this.loadSubMenu(section);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private loadSubMenu(section: string) {
    // Prefer cache first
    const subCache = localStorage.getItem('subPermissions');
    if (subCache) {
      try {
        const list = (JSON.parse(subCache) || []).filter((p: any) => p.isvisible);
        this.optionsForCurrentSection = list;
        return;
      } catch {}
    }

    const roleId = localStorage.getItem('roleId');
    const token = localStorage.getItem('token');

    if (!roleId || !token) {
      this.optionsForCurrentSection = [];
      return;
    }

    const headers = new HttpHeaders({});
    this.http
      .get<PermissionsResponse>(`${this.apiUrl}/auth/permissions`, { headers, withCredentials: true })
      .subscribe({
        next: (data) => {
          const list = (data.subPermissions || []).filter((p: any) => p.isvisible);
          localStorage.setItem('subPermissions', JSON.stringify(list));
          this.optionsForCurrentSection = list;
        },
        error: () => {
          this.optionsForCurrentSection = [];
        },
      });
  }
}
