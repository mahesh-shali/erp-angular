import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SidebarItem } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth';
import { MenuService } from '../../services/menu.service';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidenavbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidenavbar.html',
  styleUrl: './sidenavbar.scss',
})
export class Sidenavbar implements OnInit {
  navItems: SidebarItem[] = [];
  selectedSection: string | null = null;
  private sub!: Subscription;

  @Output() sectionSelected = new EventEmitter<string>();

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private menuService: MenuService,
    private router: Router,
    private uiService: UiService
  ) {
    this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
      this.selectedSection = null; // collapse subsidenav
    });
  }

  // selectSection(section: string) {
  //   this.selectedSection = section;
  // }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
  ngOnInit(): void {
    // const roleId = localStorage.getItem('roleId');
    // if (!roleId) {
    //   console.error('Missing roleId in localStorage');
    //   return;
    this.auth.loginState$.subscribe((roleId) => {
      if (roleId) {
        this.loadMenu(roleId);
      } else {
        this.navItems = [];
      }
    });
  }

  //   const cache = localStorage.getItem('mainPermissions');
  //   const timestamp = localStorage.getItem('mainPermissions:timestamp');
  //   const FIVE_SECONDS = 5 * 1000;
  //   const now = Date.now();

  //   if (cache && timestamp && now - parseInt(timestamp) < FIVE_SECONDS) {
  //     this.navItems = JSON.parse(cache).filter(
  //       (item: SidebarItem) => item.isvisible
  //     );
  //   } else {
  //     this.http
  //       .get<any>(`http://localhost:5133/api/auth/permissions/${roleId}`)
  //       .subscribe({
  //         next: (data) => {
  //           const mainPermissions = data.mainPermissions || [];

  //           // Cache main permissions with timestamp
  //           localStorage.setItem(
  //             'mainPermissions',
  //             JSON.stringify(mainPermissions)
  //           );
  //           localStorage.setItem('mainPermissions:timestamp', now.toString());

  //           this.navItems = mainPermissions.filter(
  //             (item: SidebarItem) => item.isvisible
  //           );
  //         },
  //         error: (err) => console.error('Error loading nav items', err),
  //       });
  //   }
  // }

  // selectSection(section: string) {
  //   this.selectedSection = section;
  //   this.sectionSelected.emit(section);
  // }

  private loadMenu(roleId: number) {
    const cache = localStorage.getItem('mainPermissions');
    const timestamp = localStorage.getItem('mainPermissions:timestamp');
    const FIVE_SECONDS = 5 * 1000;
    const now = Date.now();

    if (cache && timestamp && now - parseInt(timestamp) < FIVE_SECONDS) {
      this.navItems = JSON.parse(cache).filter(
        (item: SidebarItem) => item.isvisible
      );
    } else {
      this.http
        .get<any>(`${this.apiUrl}/api/auth/permissions/${roleId}`)
        .subscribe({
          next: (data) => {
            const mainPermissions = data.mainPermissions || [];

            localStorage.setItem(
              'mainPermissions',
              JSON.stringify(mainPermissions)
            );
            localStorage.setItem('mainPermissions:timestamp', now.toString());

            this.navItems = mainPermissions.filter(
              (item: SidebarItem) => item.isvisible
            );
          },
          error: (err) => console.error('Error loading nav items', err),
        });
    }
  }

  selectSection(section: string) {
    this.selectedSection = section;
    this.sectionSelected.emit(section);
    if (section.toLowerCase() === 'dashboard') {
      this.router.navigate(['s/dashboard']);
      return;
    }
    if (section.toLowerCase() === 'ai') {
      this.menuService.setSelectedSection(''); // ✅ close submenu
      this.router.navigate(['s/ai']);
      return;
    }
    this.menuService.setSelectedSection(section);
    this.selectedSection = section;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
