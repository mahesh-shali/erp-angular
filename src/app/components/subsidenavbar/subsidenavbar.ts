// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Component, Input, OnInit } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { Router, RouterModule } from '@angular/router';
// import { MenuService } from '../../services/menu.service';
// import { AuthService } from '../../services/auth';
// import { environment } from 'src/environments/environment';
// import {
//   SubPermission as ServiceSubPermission,
//   PermissionsService,
// } from 'src/app/services/permissions.service';

// interface SubPermission {
//   label: string;
//   option: string;
//   route: string;
//   isvisible: boolean;
//   icon?: string;
//   nestedPermissions?: SubPermission[];
//   isOpen?: boolean;
// }

// interface PermissionsResponse {
//   mainPermissions: any[];
//   subPermissions: SubPermission[];
//   nestedSubPermissions: any[];
// }

// interface ComponentSubPermission extends ServiceSubPermission {
//   nestedPermissions: ComponentSubPermission[];
//   isOpen: boolean;
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
//   optionsForCurrentSection: SubPermission[] = [];
//   isAccordionOpen = true;

//   //sectionOptions: { [key: string]: SubPermission[] } = {};
//   sectionOptions: { [key: string]: ServiceSubPermission[] } = {};
//   prevOpenStates: Record<number, boolean> = {};

//   private apiUrl = environment.apiUrl;

//   constructor(
//     private http: HttpClient,
//     private menuService: MenuService,
//     private auth: AuthService,
//     private router: Router,
//     private permissionsService: PermissionsService
//   ) {}

//   isLoginPage(): boolean {
//     return this.router.url === '/login';
//   }

//   // ngOnInit(): void {
//   //   this.menuService.selectedSection$.subscribe((section) => {
//   //     if (section) {
//   //       // this.loadSubMenu(section);
//   //       this.isAccordionOpen = true;

//   //       this.permissionsService.subPermissions$.subscribe((subs) => {
//   //         this.optionsForCurrentSection = subs
//   //           .filter((sp) => sp.label === section && sp.isvisible)
//   //           .map((sp) => ({
//   //             ...sp,
//   //             isOpen: sp.isOpen ?? false,
//   //             nestedPermissions: sp.nestedPermissions ?? [],
//   //           }));
//   //       });
//   //     } else {
//   //       this.optionsForCurrentSection = [];
//   //     }
//   //   });
//   // }

//   ngOnInit(): void {
//     this.menuService.selectedSection$.subscribe((section) => {
//       if (section) {
//         this.isAccordionOpen = true;

//         this.permissionsService.subPermissions$.subscribe((subs) => {
//           this.optionsForCurrentSection = subs
//             .filter((sp) => sp.label === section && sp.isvisible)
//             .map((sp) => this.restoreSubPermission(sp));
//         });
//       } else {
//         this.optionsForCurrentSection = [];
//       }
//     });
//   }

//   private restoreSubPermission(
//     sp: ServiceSubPermission
//   ): ComponentSubPermission {
//     const restored: ComponentSubPermission = {
//       ...sp,
//       isOpen: this.prevOpenStates[sp.id] ?? sp.isOpen ?? false,
//       nestedPermissions: (sp.nestedPermissions || []).map((np) => ({
//         ...np,
//         label: np.label ?? 'Unknown', // Provide defaults for missing fields
//         isvisible: np.isvisible ?? true,
//         orguserid: np.orguserid ?? sp.orguserid,
//         subsidenavbarid: np.subsidenavbarid ?? sp.subsidenavbarid,
//         nestedPermissions: np.nestedPermissions || [],
//         isOpen: false,
//       })),
//     };

//     this.prevOpenStates[sp.id] = restored.isOpen;
//     return restored;
//   }

//   toggleAccordion() {
//     this.isAccordionOpen = !this.isAccordionOpen;
//   }

//   toggleNested(item: any) {
//     item.isOpen = !item.isOpen;
//     this.prevOpenStates[item.id] = item.isOpen;
//   }

//   navigate(item: SubPermission) {
//     if (item.route && item.route.trim().length > 0) {
//       this.router.navigate([item.route]);
//     }
//   }

//   // private loadSubMenu(section: string) {
//   //   const headers = new HttpHeaders({});

//   //   this.http
//   //     .get<any[]>(`${this.apiUrl}/auth/permissions`, {
//   //       headers,
//   //       withCredentials: true,
//   //     })
//   //     .subscribe({
//   //       next: (data) => {
//   //         const mainItem = data.find(
//   //           (item) => item.section.toLowerCase() === section.toLowerCase()
//   //         );
//   //         this.optionsForCurrentSection =
//   //           mainItem?.subPermissions?.filter((sp: any) => sp.isvisible) || [];

//   //         // Cache it if you want
//   //         this.sectionOptions[section] = this.optionsForCurrentSection;

//   //         console.log(
//   //           'Loaded subPermissions for',
//   //           section,
//   //           this.optionsForCurrentSection
//   //         );
//   //       },
//   //       error: (err) => {
//   //         console.error('Error loading sub nav items', err);
//   //         this.optionsForCurrentSection = [];
//   //       },
//   //     });
//   // }
// }

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth';
import { environment } from 'src/environments/environment';
import {
  SubPermission as ServiceSubPermission,
  PermissionsService,
} from 'src/app/services/permissions.service';

// Component-specific type
interface ComponentSubPermission extends ServiceSubPermission {
  nestedPermissions: ComponentSubPermission[];
  isOpen: boolean;
  icon?: string;
  label: string;
  isvisible: boolean;
  orguserid: number;
  subsidenavbarid: number;
  id: number;
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
  optionsForCurrentSection: ComponentSubPermission[] = [];
  isAccordionOpen = true;
  selectedRoute: string = '';

  prevOpenStates: Record<number, boolean> = {};

  constructor(
    private http: HttpClient,
    private menuService: MenuService,
    private auth: AuthService,
    private router: Router,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.menuService.selectedSection$.subscribe((section) => {
      if (section) {
        this.isAccordionOpen = true;

        this.permissionsService.subPermissions$.subscribe((subs) => {
          this.optionsForCurrentSection = subs
            .filter((sp) => sp.label === section && sp.isvisible)
            .map((sp) => this.restoreSubPermission(sp));
        });
      } else {
        this.optionsForCurrentSection = [];
      }
    });
  }

  /** Public method for template */
  public isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  /** Recursive mapping to ensure proper structure for nested permissions */
  private restoreSubPermission(
    sp: ServiceSubPermission
  ): ComponentSubPermission {
    const restored: ComponentSubPermission = {
      ...sp,
      id: (sp as any).id ?? 0,
      label: sp.label ?? 'Unknown',
      isvisible: sp.isvisible ?? true,
      orguserid: (sp as any).orguserid ?? 0,
      subsidenavbarid: (sp as any).subsidenavbarid ?? 0,
      isOpen: this.prevOpenStates[(sp as any).id] ?? sp.isOpen ?? false,
      icon: (sp as any).icon ?? '',
      nestedPermissions: (sp.nestedPermissions || []).map((np) =>
        this.restoreNestedPermission(np as ServiceSubPermission, sp)
      ),
    };

    this.prevOpenStates[restored.id] = restored.isOpen;
    return restored;
  }

  private restoreNestedPermission(
    np: ServiceSubPermission,
    parent: ServiceSubPermission
  ): ComponentSubPermission {
    const restored: ComponentSubPermission = {
      ...np,
      id: (np as any).id ?? 0,
      label: np.label ?? 'Unknown',
      isvisible: np.isvisible ?? true,
      orguserid: (np as any).orguserid ?? (parent as any).orguserid ?? 0,
      subsidenavbarid:
        (np as any).subsidenavbarid ?? (parent as any).subsidenavbarid ?? 0,
      isOpen: this.prevOpenStates[(np as any).id] ?? np.isOpen ?? false,
      icon: (np as any).icon ?? '',
      nestedPermissions: (np.nestedPermissions || []).map((nested) =>
        this.restoreNestedPermission(nested as ServiceSubPermission, np)
      ),
    };

    this.prevOpenStates[restored.id] = restored.isOpen;
    return restored;
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  toggleNested(item: ComponentSubPermission) {
    item.isOpen = !item.isOpen;
    this.prevOpenStates[item.id] = item.isOpen;
  }

  navigate(item: ComponentSubPermission) {
    if (item.route && item.route.trim()) {
      this.router.navigate([item.route]);
      this.selectedRoute = item.route;
    }
  }

  isSelected(item: ComponentSubPermission): boolean {
    if (item.route === this.selectedRoute) return true;
    return item.nestedPermissions?.some((np) => this.isSelected(np)) ?? false;
  }
}
