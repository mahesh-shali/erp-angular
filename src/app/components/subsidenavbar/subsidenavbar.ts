// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, Input, OnInit } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { Router, RouterModule } from '@angular/router';
// import { MenuService } from '../../services/menu.service';
// import { AuthService } from '../../services/auth';
// import { environment } from 'src/environments/environment.prod';

// interface SubPermission {
//   label: string;
//   option: string;
//   route: string;
//   isvisible: boolean;
//   icon?: string;
// }

// @Component({
//   selector: 'app-subsidenavbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MatIconModule],
//   templateUrl: './subsidenavbar.html',
//   styleUrls: ['./subsidenavbar.scss'],
// })
// export class Subsidenavbar implements OnInit {
//   @Input() section = '';
//   optionsForCurrentSection: any[] = [];

//   sectionOptions: { [key: string]: SubPermission[] } = {};

//   private apiUrl = environment.apiUrl;

//   constructor(
//     private http: HttpClient,
//     private menuService: MenuService,
//     private auth: AuthService,
//     private router: Router
//   ) {}

//   isLoginPage(): boolean {
//     return this.router.url === '/login';
//   }

//   ngOnInit(): void {
//     this.menuService.selectedSection$.subscribe((section) => {
//       if (section) {
//         this.loadSubMenu(section);
//       } else {
//         this.optionsForCurrentSection = [];
//       }
//     });
//   }

//   private loadSubMenu(section: string) {
//     const roleId = localStorage.getItem('roleId');
//     if (!roleId) {
//       console.error('Missing roleId for submenu load');
//       return;
//     }
//     console.log('Loading submenu for roleId:', roleId, 'section:', section);

//     this.http.get<any>(`${this.apiUrl}/auth/permissions/${roleId}`).subscribe({
//       next: (data) => {
//         console.log('Submenu API response:', data);
//         this.optionsForCurrentSection = data.subPermissions || [];
//       },
//       error: (err) => console.error('Error loading sub nav items', err),
//     });
//   }
// }

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth';
import { environment } from 'src/environments/environment.prod';

interface SubPermission {
  label: string;
  option: string;
  route: string;
  isvisible: boolean;
  icon?: string;
}

interface PermissionsResponse {
  mainPermissions: any[];
  subPermissions: SubPermission[];
}

@Component({
  selector: 'app-subsidenavbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './subsidenavbar.html',
  styleUrls: ['./subsidenavbar.scss'],
})
export class Subsidenavbar implements OnInit {
  @Input() section = '';
  optionsForCurrentSection: SubPermission[] = [];
  isAccordionOpen = true;

  sectionOptions: { [key: string]: SubPermission[] } = {};

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private menuService: MenuService,
    private auth: AuthService,
    private router: Router
  ) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit(): void {
    this.menuService.selectedSection$.subscribe((section) => {
      if (section) {
        this.loadSubMenu(section);
        this.isAccordionOpen = true;
      } else {
        this.optionsForCurrentSection = [];
      }
    });
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  private loadSubMenu(section: string) {
    const roleId = localStorage.getItem('roleId');
    const token = localStorage.getItem('token');

    if (!roleId) {
      console.error('Missing roleId for submenu load');
      return;
    }

    if (!token) {
      console.warn('Unauthorized: missing token');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<PermissionsResponse>(`${this.apiUrl}/auth/permissions/${roleId}`, {
        headers,
      })
      .subscribe({
        next: (data) => {
          this.optionsForCurrentSection = data.subPermissions.filter(
            (p) => p.isvisible
          );
        },
        error: (err) => {
          console.error('Error loading sub nav items', err);
          if (err.status === 401) {
            console.warn('Unauthorized! Redirecting to login...');
            this.auth.logout(); // optionally clear auth state
            this.router.navigate(['/login']);
          }
        },
      });
  }
}
