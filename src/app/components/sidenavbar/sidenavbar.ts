// import {
//   Component,
//   EventEmitter,
//   OnInit,
//   Output,
//   OnDestroy,
// } from '@angular/core';
// import { SidebarItem, SubPermission } from '../../constants/constants';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { AuthService } from '../../services/auth';
// import { MenuService } from '../../services/menu.service';
// import { UiService } from '../../services/ui.service';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { PermissionsService } from '../../services/permissions.service';

// // Aliases for clarity in mobile hierarchy
// type RootPermission = SidebarItem;
// type ChildPermission = SubPermission;

// interface PermissionsResponse {
//   mainPermissions: SidebarItem[];
//   subPermissions?: any[];
//   nestedSubPermissions?: any[];
// }

// interface MobileSidebarItem {
//   id: number;
//   label: string;
//   section: string;
//   icon: string;
//   route: string;
//   isvisible: boolean;
//   subPermissions: ChildPermission[];
//   isOpen: boolean;
// }

// @Component({
//   selector: 'app-sidenavbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MatIconModule],
//   templateUrl: './sidenavbar.html',
//   styleUrls: ['./sidenavbar.scss'], // fixed typo from styleUrl -> styleUrls
// })
// export class Sidenavbar implements OnInit, OnDestroy {
//   navItems: SidebarItem[] = [];
//   selectedSection: string | null = null;
//   private sub!: Subscription;
//   mobileAccordionOpen = false;
//   private sidebarItems$ = new BehaviorSubject<SidebarItem[]>([]);

//   optionsForCurrentSection: Array<{
//     label?: string;
//     option: string;
//     route: string;
//     isvisible: boolean;
//     icon?: string;
//     nestedPermissions?: any[];
//     isOpen?: boolean;
//     id?: number;
//   }> = [];
//   mobileSidebarItems: MobileSidebarItem[] = [];
//   private prevMobileSubs: ChildPermission[] = [];

//   @Output() sectionSelected = new EventEmitter<string>();
//   items$ = this.sidebarItems$.asObservable();

//   private apiUrl = environment.apiUrl;

//   constructor(
//     private http: HttpClient,
//     private auth: AuthService,
//     private menuService: MenuService,
//     private router: Router,
//     public uiService: UiService,
//     private permissionsService: PermissionsService
//   ) {
//     this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
//       this.selectedSection = null; // collapse subsidenav
//     });
//   }

//   isLoginPage(): boolean {
//     return this.router.url === '/login';
//   }

//   ngOnInit(): void {
//     // Initialize navItems with default isOpen states
//     console.log('permissionsService', this.permissionsService);
//     this.navItems.forEach((item) => {
//       item.isOpen = false;
//       item.subPermissions?.forEach((sub) => {
//         sub.isOpen = false;
//         sub.nestedPermissions?.forEach((nested) => (nested.isOpen = false));
//       });
//       console.log('nav item', item);
//     });

//     // Subscribe to login state
//     this.auth.loginState$.subscribe((roleId) => {
//       if (roleId) {
//         this.loadMenu(roleId);
//         this.permissionsService.startPolling(roleId);

//         // Subscribe to subPermissions updates
//         this.permissionsService.subPermissions$.subscribe(
//           (newSubPermissions) => {
//             // Preserve previous open states
//             const prevState = this.optionsForCurrentSection.reduce(
//               (acc, sub) => {
//                 if (sub.id !== undefined) acc[sub.id] = sub.isOpen ?? false;
//                 return acc;
//               },
//               {} as Record<number, boolean>
//             );

//             // Map new subPermissions with preserved open state
//             this.optionsForCurrentSection = newSubPermissions
//               .filter((sub) => sub.isvisible)
//               .map((sub) => ({
//                 ...sub,
//                 isOpen: sub.id !== undefined ? prevState[sub.id] : false,
//                 nestedPermissions:
//                   sub.nestedPermissions?.map((nested) => ({
//                     ...nested,
//                     isOpen: nested.isOpen ?? false,
//                     nestedPermissions:
//                       nested.nestedPermissions?.map((child) => ({
//                         ...child,
//                         isOpen: child.isOpen ?? false,
//                       })) || [],
//                   })) || [],
//               }));
//           }
//         );

//         // Subscribe to mainPermissions updates
//         this.permissionsService.mainPermissions$.subscribe((list) => {
//           this.navItems = list
//             .filter((item) => item.isvisible)
//             .map((item) => ({
//               ...item,
//               isOpen: item.isOpen ?? false,
//               subPermissions:
//                 item.subPermissions
//                   ?.filter((sub) => sub.isvisible)
//                   .map((sub) => ({
//                     ...sub,
//                     isOpen: sub.isOpen ?? false,
//                     nestedPermissions:
//                       sub.nestedPermissions
//                         ?.filter((n) => n.isvisible)
//                         .map((n) => ({
//                           ...n,
//                           isOpen: n.isOpen ?? false,
//                           nestedPermissions:
//                             n.nestedPermissions
//                               ?.filter((c) => c.isvisible)
//                               .map((c) => ({
//                                 ...c,
//                                 isOpen: c.isOpen ?? false,
//                               })) || [],
//                         })) || [],
//                   })) || [],
//             }));
//           this.mobileSidebarItems = this.getMobileHierarchy(
//             this.navItems as RootPermission[],
//             this.prevMobileSubs
//           );
//           this.prevMobileSubs = this.mobileSidebarItems.flatMap(
//             (mi) => mi.subPermissions
//           );
//           console.log('navbar', this.navItems);
//         });
//       } else {
//         this.navItems = [];
//         this.mobileSidebarItems = [];
//         this.permissionsService.stopPolling();
//       }
//     });
//   }

//   private loadMenu(roleId: number) {
//     const cache = localStorage.getItem('mainPermissions');
//     if (cache) {
//       try {
//         const cached = JSON.parse(cache) as SidebarItem[];
//         this.navItems = cached.filter((item: SidebarItem) => item.isvisible);
//         return;
//       } catch {}
//     }

//     // If no cache yet, subscribe once to the permissions stream for the first value
//     const sub = this.permissionsService.mainPermissions$.subscribe((list) => {
//       if (list && list.length) {
//         this.navItems = list.filter((item: SidebarItem) => item.isvisible);
//         sub.unsubscribe();
//       }
//     });
//   }

//   private getMobileHierarchy(
//     rootPermissions: RootPermission[],
//     previousChildren: ChildPermission[]
//   ): MobileSidebarItem[] {
//     return rootPermissions
//       .filter((rootPerm) => rootPerm.isvisible)
//       .map((rootPerm) => {
//         const updatedChildren: ChildPermission[] = (
//           rootPerm.subPermissions || []
//         ).map((childPerm) => {
//           const previousChild = previousChildren.find(
//             (pc) => pc.id === childPerm.id
//           );

//           const updatedNestedChildren = (childPerm.nestedPermissions || []).map(
//             (nestedPerm) => {
//               const previousNested = previousChild?.nestedPermissions?.find(
//                 (pn) => pn.id === nestedPerm.id
//               );
//               return {
//                 ...nestedPerm,
//                 isOpen: previousNested?.isOpen ?? false,
//               };
//             }
//           );

//           return {
//             ...childPerm,
//             nestedPermissions: updatedNestedChildren,
//             isOpen: previousChild?.isOpen ?? false,
//           };
//         });

//         const mobileItem: MobileSidebarItem = {
//           id: rootPerm.id,
//           label: rootPerm.label,
//           section: rootPerm.section,
//           icon: rootPerm.icon ?? '',
//           route: '',
//           isvisible: rootPerm.isvisible,
//           subPermissions: updatedChildren,
//           isOpen: false,
//         };

//         return mobileItem;
//       });
//   }

//   selectSection(section: string) {
//     const normalized = section.toLowerCase();

//     // Special handling for Dashboard: never open mobile submenu/accordion
//     if (normalized === 'dashboard') {
//       this.selectedSection = section;
//       this.mobileAccordionOpen = false; // ensure accordion is closed
//       this.optionsForCurrentSection = []; // clear any prior submenu options
//       this.menuService.setSelectedSection(''); // collapse subsidenav state
//       this.sectionSelected.emit(section);
//       this.router.navigate(['s/dashboard']);
//       return;
//     }

//     // Toggle mobile accordion when the same non-dashboard section is clicked; otherwise open and load
//     if (this.selectedSection === section) {
//       this.mobileAccordionOpen = !this.mobileAccordionOpen;
//     } else {
//       this.selectedSection = section;
//       this.mobileAccordionOpen = true;
//     }

//     this.sectionSelected.emit(section);

//     if (normalized === 'ai') {
//       this.menuService.setSelectedSection('');
//       this.router.navigate(['s/ai']);
//       return;
//     }

//     this.menuService.setSelectedSection(section);
//     // Load submenu options for accordion (mobile)
//     // this.loadSubMenu(section);
//   }
//   navigate(item: any) {
//     if (item.route) {
//       this.router.navigate([item.route]);
//     }
//   }

//   ngOnDestroy() {
//     this.sub.unsubscribe();
//   }

//   // private loadSubMenu(section: string) {
//   //   // Prefer cache first
//   //   const subCache = localStorage.getItem('subPermissions');
//   //   if (subCache) {
//   //     try {
//   //       const list = (JSON.parse(subCache) || []).filter(
//   //         (p: any) => p.isvisible
//   //       );
//   //       this.optionsForCurrentSection = list;
//   //       return;
//   //     } catch {}
//   //   }

//   //   const roleId = localStorage.getItem('roleId');
//   //   const token = localStorage.getItem('token');

//   //   if (!roleId || !token) {
//   //     this.optionsForCurrentSection = [];
//   //     return;
//   //   }

//   //   const headers = new HttpHeaders({});
//   //   this.http
//   //     .get<PermissionsResponse[]>(`${this.apiUrl}/auth/permissions`, {
//   //       headers,
//   //       withCredentials: true,
//   //     })
//   //     .subscribe({
//   //       next: (data) => {
//   //         console.log('Sub nav data', data);
//   //         // const list = (data.subPermissions || []).filter(
//   //         //   (p: any) => p.isvisible
//   //         // );

//   //         const list = data
//   //           .flatMap((p) => p.subPermissions || [])
//   //           .filter((sp) => sp.isvisible);

//   //         console.log('Filtered subPermissions:', list);
//   //         localStorage.setItem('subPermissions', JSON.stringify(list));
//   //         this.optionsForCurrentSection = list;
//   //       },
//   //       error: (err) => {
//   //         this.optionsForCurrentSection = [];
//   //         console.error('Error loading sub nav items', err);
//   //       },
//   //     });
//   // }
// }

//------------------------------------------------------------------------------------//
// import {
//   Component,
//   EventEmitter,
//   OnInit,
//   Output,
//   OnDestroy,
// } from '@angular/core';
// import { SidebarItem, SubPermission } from '../../constants/constants';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { HttpClient } from '@angular/common/http';

// import { AuthService } from '../../services/auth';
// import { MenuService } from '../../services/menu.service';
// import { UiService } from '../../services/ui.service';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { PermissionsService } from '../../services/permissions.service';

// // Aliases for clarity
// type RootPermission = SidebarItem;
// type ChildPermission = SubPermission;

// interface MobileSidebarItem {
//   id: number;
//   label: string;
//   section: string;
//   icon: string;
//   route: string;
//   isvisible: boolean;
//   subPermissions: ChildPermission[];
//   isOpen: boolean;
// }

// @Component({
//   selector: 'app-sidenavbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MatIconModule],
//   templateUrl: './sidenavbar.html',
//   styleUrls: ['./sidenavbar.scss'],
// })
// export class Sidenavbar implements OnInit, OnDestroy {
//   navItems: SidebarItem[] = [];
//   selectedSection: string | null = null;
//   private sub!: Subscription;
//   private sidebarItems$ = new BehaviorSubject<SidebarItem[]>([]);

//   mobileSidebarItems: MobileSidebarItem[] = [];
//   private prevMobileSubs: ChildPermission[] = [];

//   @Output() sectionSelected = new EventEmitter<string>();
//   items$ = this.sidebarItems$.asObservable();
//   constructor(
//     private http: HttpClient,
//     private auth: AuthService,
//     private menuService: MenuService,
//     private router: Router,
//     public uiService: UiService,
//     private permissionsService: PermissionsService
//   ) {
//     this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
//       this.selectedSection = null; // collapse subsidenav
//     });
//   }

//   isLoginPage(): boolean {
//     return this.router.url === '/login';
//   }

//   ngOnInit(): void {
//     // Reset isOpen flags
//     this.navItems.forEach((item) => {
//       item.isOpen = false;
//       item.subPermissions?.forEach((sub) => {
//         sub.isOpen = false;
//         sub.nestedPermissions?.forEach((nested) => (nested.isOpen = false));
//       });
//     });

//     this.auth.loginState$.subscribe((roleId) => {
//       if (roleId) {
//         this.loadMenu(roleId);
//         this.permissionsService.startPolling(roleId);

//         // Watch for main permission changes (desktop + mobile)
//         this.permissionsService.mainPermissions$.subscribe((list) => {
//           console.log('Main permissions update', list);
//           this.navItems = list
//             .filter((item) => item.isvisible)
//             .map((item) => ({
//               ...item,
//               isOpen: item.isOpen ?? false,
//               subPermissions:
//                 item.subPermissions
//                   ?.filter((sub) => sub.isvisible)
//                   .map((sub) => ({
//                     ...sub,
//                     isOpen: sub.isOpen ?? false,
//                     nestedPermissions:
//                       sub.nestedPermissions
//                         ?.filter((n) => n.isvisible)
//                         .map((n) => ({
//                           ...n,
//                           isOpen: n.isOpen ?? false,
//                           nestedPermissions:
//                             n.nestedPermissions
//                               ?.filter((c) => c.isvisible)
//                               .map((c) => ({
//                                 ...c,
//                                 isOpen: c.isOpen ?? false,
//                               })) || [],
//                         })) || [],
//                   })) || [],
//             }));

//           // Build mobile sidebar hierarchy
//           this.mobileSidebarItems = this.getMobileHierarchy(
//             this.navItems as RootPermission[],
//             this.prevMobileSubs
//           );

//           // store current state for next rebuild
//           this.prevMobileSubs = this.mobileSidebarItems.flatMap(
//             (mi) => mi.subPermissions
//           );
//           this.subscribeFullPermissions();
//         });
//       } else {
//         this.navItems = [];
//         this.mobileSidebarItems = [];
//         this.permissionsService.stopPolling();
//       }
//     });
//   }

//   private loadMenu(roleId: number) {
//     const cache = localStorage.getItem('mainPermissions');
//     if (cache) {
//       try {
//         const cached = JSON.parse(cache) as SidebarItem[];
//         this.navItems = cached.filter((item: SidebarItem) => item.isvisible);
//         return;
//       } catch {}
//     }

//     const sub = this.permissionsService.mainPermissions$.subscribe((list) => {
//       if (list && list.length) {
//         this.navItems = list.filter((item: SidebarItem) => item.isvisible);
//         sub.unsubscribe();
//       }
//     });
//   }

//   private subscribeFullPermissions() {
//     this.permissionsService.fullPermissions$.subscribe((fullList) => {
//       console.log('📦 Full permissions:', fullList);
//       this.mobileSidebarItems = this.getMobileHierarchy(
//         fullList as RootPermission[],
//         this.prevMobileSubs
//       );
//       this.prevMobileSubs = this.mobileSidebarItems.flatMap(
//         (mi) => mi.subPermissions
//       );
//     });
//   }

//   private getMobileHierarchy(
//     rootPermissions: RootPermission[],
//     previousChildren: ChildPermission[]
//   ): MobileSidebarItem[] {
//     const result = rootPermissions
//       .filter((rootPerm) => rootPerm.isvisible)
//       .map((rootPerm) => {
//         const updatedChildren: ChildPermission[] = (
//           rootPerm.subPermissions || []
//         )
//           .filter((child) => child.isvisible)
//           .map((childPerm) => {
//             const prevChild = previousChildren.find(
//               (pc) => pc.id === childPerm.id
//             );

//             const updatedNested = (childPerm.nestedPermissions || [])
//               .filter((nested) => nested.isvisible)
//               .map((nestedPerm) => {
//                 const prevNested = prevChild?.nestedPermissions?.find(
//                   (pn) => pn.id === nestedPerm.id
//                 );
//                 return {
//                   ...nestedPerm,
//                   isOpen: prevNested?.isOpen ?? false,
//                 };
//               });

//             return {
//               ...childPerm,
//               nestedPermissions: updatedNested,
//               isOpen: prevChild?.isOpen ?? false,
//             };
//           });
//         const prevRoot = previousChildren.find((pc) => pc.id === rootPerm.id);

//         return {
//           id: rootPerm.id,
//           label: rootPerm.label,
//           section: rootPerm.section,
//           icon: rootPerm.icon ?? '',
//           route: rootPerm.route ?? '',
//           isvisible: rootPerm.isvisible,
//           subPermissions: updatedChildren,
//           isOpen: prevRoot?.isOpen ?? this.selectedSection === rootPerm.section,
//         };
//       });
//     return result;
//   }

//   selectSection(section: string) {
//     const normalized = section.toLowerCase();

//     if (normalized === 'dashboard') {
//       this.selectedSection = section;
//       this.menuService.setSelectedSection('');
//       this.sectionSelected.emit(section);
//       this.router.navigate(['s/dashboard']);
//       return;
//     }

//     if (this.selectedSection === section) {
//       // toggle
//       const item = this.mobileSidebarItems.find((mi) => mi.section === section);
//       if (item) item.isOpen = !item.isOpen;
//     } else {
//       this.selectedSection = section;
//       this.mobileSidebarItems.forEach((mi) => (mi.isOpen = false));
//       const item = this.mobileSidebarItems.find((mi) => mi.section === section);
//       if (item) item.isOpen = true;
//     }

//     this.sectionSelected.emit(section);

//     if (normalized === 'ai') {
//       this.menuService.setSelectedSection('');
//       this.router.navigate(['s/ai']);
//       return;
//     }

//     this.menuService.setSelectedSection(section);
//   }

//   navigate(item: any) {
//     if (item.route) {
//       this.router.navigate([item.route]);
//     }
//   }

//   ngOnDestroy() {
//     if (this.sub) {
//       this.sub.unsubscribe();
//     }
//   }
// }

// import {
//   Component,
//   EventEmitter,
//   OnInit,
//   Output,
//   OnDestroy,
// } from '@angular/core';
// import { SidebarItem, SubPermission } from '../../constants/constants';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { HttpClient } from '@angular/common/http';

// import { AuthService } from '../../services/auth';
// import { MenuService } from '../../services/menu.service';
// import { UiService } from '../../services/ui.service';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { PermissionsService } from '../../services/permissions.service';

// // Aliases for clarity
// type RootPermission = SidebarItem;
// type ChildPermission = SubPermission;

// interface MobileSidebarItem {
//   id: number;
//   label: string;
//   section: string;
//   icon: string;
//   route: string;
//   isvisible: boolean;
//   subPermissions: ChildPermission[];
//   isOpen: boolean;
// }

// @Component({
//   selector: 'app-sidenavbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MatIconModule],
//   templateUrl: './sidenavbar.html',
//   styleUrls: ['./sidenavbar.scss'],
// })
// export class Sidenavbar implements OnInit, OnDestroy {
//   navItems: SidebarItem[] = [];
//   selectedSection: string | null = null;
//   private sub!: Subscription;
//   private sidebarItems$ = new BehaviorSubject<SidebarItem[]>([]);

//   mobileSidebarItems: MobileSidebarItem[] = [];
//   private prevMobileSubs: ChildPermission[] = [];

//   @Output() sectionSelected = new EventEmitter<string>();
//   items$ = this.sidebarItems$.asObservable();

//   constructor(
//     private http: HttpClient,
//     private auth: AuthService,
//     private menuService: MenuService,
//     private router: Router,
//     public uiService: UiService,
//     private permissionsService: PermissionsService
//   ) {
//     this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
//       this.selectedSection = null; // collapse subsidenav
//     });
//   }

//   isLoginPage(): boolean {
//     return this.router.url === '/login';
//   }

//   ngOnInit(): void {
//     // Reset isOpen flags
//     this.resetNavItems();

//     this.auth.loginState$.subscribe((roleId) => {
//       if (roleId) {
//         this.loadMenu(roleId);
//         this.permissionsService.startPolling(roleId);

//         // Subscribe to main permissions
//         this.permissionsService.mainPermissions$.subscribe((list) => {
//           this.navItems = this.buildNavItems(list);
//           this.mobileSidebarItems = this.getMobileHierarchy(
//             this.navItems as RootPermission[],
//             this.prevMobileSubs
//           );
//           this.prevMobileSubs = this.mobileSidebarItems.flatMap(
//             (mi) => mi.subPermissions
//           );

//           // Also subscribe to full permissions for mobile menu
//           this.subscribeFullPermissions();
//         });
//       } else {
//         this.navItems = [];
//         this.mobileSidebarItems = [];
//         this.permissionsService.stopPolling();
//       }
//     });
//   }

//   private resetNavItems() {
//     this.navItems.forEach((item) => {
//       item.isOpen = false;
//       item.subPermissions?.forEach((sub) => {
//         sub.isOpen = false;
//         sub.nestedPermissions?.forEach((nested) => (nested.isOpen = false));
//       });
//     });
//   }

//   private loadMenu(roleId: number) {
//     const cache = localStorage.getItem('mainPermissions');
//     if (cache) {
//       try {
//         const cached = JSON.parse(cache) as SidebarItem[];
//         this.navItems = cached.filter((item: SidebarItem) => item.isvisible);
//         return;
//       } catch {}
//     }

//     const sub = this.permissionsService.mainPermissions$.subscribe((list) => {
//       if (list && list.length) {
//         this.navItems = list.filter((item: SidebarItem) => item.isvisible);
//         sub.unsubscribe();
//       }
//     });
//   }

//   private subscribeFullPermissions() {
//     this.permissionsService.fullPermissions$.subscribe((fullList) => {
//       this.mobileSidebarItems = this.getMobileHierarchy(
//         fullList as RootPermission[],
//         this.mobileSidebarItems
//       );
//       this.prevMobileSubs = this.mobileSidebarItems.flatMap(
//         (mi) => mi.subPermissions
//       );
//     });
//   }

//   private buildNavItems(list: SidebarItem[]): SidebarItem[] {
//     return list
//       .filter((item) => item.isvisible)
//       .map((item) => ({
//         ...item,
//         isOpen: item.isOpen ?? false,
//         subPermissions:
//           item.subPermissions
//             ?.filter((sub) => sub.isvisible)
//             .map((sub) => ({
//               ...sub,
//               isOpen: sub.isOpen ?? false,
//               nestedPermissions:
//                 sub.nestedPermissions
//                   ?.filter((n) => n.isvisible)
//                   .map((n) => ({
//                     ...n,
//                     isOpen: n.isOpen ?? false,
//                     nestedPermissions:
//                       n.nestedPermissions
//                         ?.filter((c) => c.isvisible)
//                         .map((c) => ({
//                           ...c,
//                           isOpen: c.isOpen ?? false,
//                         })) || [],
//                   })) || [],
//             })) || [],
//       }));
//   }

//   private mergePermissions(
//     newPermissions: RootPermission[],
//     oldItems: MobileSidebarItem[]
//   ): MobileSidebarItem[] {
//     return newPermissions
//       .filter((root) => root.isvisible)
//       .map((root) => {
//         const oldRoot = oldItems.find((o) => o.id === root.id);

//         const mergedChildren: ChildPermission[] = (root.subPermissions || [])
//           .filter((sub) => sub.isvisible)
//           .map((sub) =>
//             this.mergeSubPermission(sub, oldRoot?.subPermissions || [])
//           );

//         return {
//           id: root.id,
//           label: root.label,
//           section: root.section,
//           icon: root.icon ?? '',
//           route: root.route ?? '',
//           isvisible: root.isvisible,
//           subPermissions: mergedChildren,
//           isOpen: oldRoot?.isOpen ?? this.selectedSection === root.section,
//         };
//       });
//   }

//   private mergeSubPermission(
//     newSub: SubPermission,
//     oldSubs: SubPermission[]
//   ): SubPermission {
//     const oldSub = oldSubs.find((o) => o.id === newSub.id);

//     const mergedNested: SubPermission[] = (newSub.nestedPermissions || [])
//       .filter((nested) => nested.isvisible)
//       .map((nested) =>
//         this.mergeSubPermission(nested, oldSub?.nestedPermissions || [])
//       );

//     return {
//       ...newSub,
//       isOpen: oldSub?.isOpen ?? false,
//       nestedPermissions: mergedNested,
//     };
//   }

//   private getMobileHierarchy(
//     rootPermissions: RootPermission[],
//     previousChildren: ChildPermission[]
//   ): MobileSidebarItem[] {
//     return rootPermissions
//       .filter((rootPerm) => rootPerm.isvisible)
//       .map((rootPerm) => {
//         // Try to find previous state for this root
//         const prevRoot = this.mobileSidebarItems.find(
//           (mi) => mi.id === rootPerm.id
//         );

//         // Merge children
//         const updatedChildren: ChildPermission[] = (
//           rootPerm.subPermissions || []
//         )
//           .filter((child) => child.isvisible)
//           .map((childPerm) => {
//             const prevChild = prevRoot?.subPermissions?.find(
//               (pc) => pc.id === childPerm.id
//             );

//             const updatedNested = (childPerm.nestedPermissions || [])
//               .filter((nested) => nested.isvisible)
//               .map((nestedPerm) => {
//                 const prevNested = prevChild?.nestedPermissions?.find(
//                   (pn) => pn.id === nestedPerm.id
//                 );
//                 return {
//                   ...nestedPerm,
//                   isOpen: prevNested?.isOpen ?? false,
//                 };
//               });

//             return {
//               ...childPerm,
//               nestedPermissions: updatedNested,
//               isOpen: prevChild?.isOpen ?? false,
//             };
//           });

//         return {
//           id: rootPerm.id,
//           label: rootPerm.label,
//           section: rootPerm.section,
//           icon: rootPerm.icon ?? '',
//           route: rootPerm.route ?? '',
//           isvisible: rootPerm.isvisible,
//           subPermissions: updatedChildren,
//           // Preserve root open state OR if this is currently selected section
//           isOpen: prevRoot?.isOpen ?? this.selectedSection === rootPerm.section,
//         };
//       });
//   }

//   selectSection(section: string) {
//     const normalized = section.toLowerCase();

//     if (normalized === 'dashboard') {
//       this.selectedSection = section;
//       this.menuService.setSelectedSection('');
//       this.sectionSelected.emit(section);
//       this.router.navigate(['s/dashboard']);
//       return;
//     }

//     if (this.selectedSection === section) {
//       const item = this.mobileSidebarItems.find((mi) => mi.section === section);
//       if (item) item.isOpen = !item.isOpen;
//     } else {
//       this.selectedSection = section;
//       this.mobileSidebarItems.forEach((mi) => (mi.isOpen = false));
//       const item = this.mobileSidebarItems.find((mi) => mi.section === section);
//       if (item) item.isOpen = true;
//     }

//     this.sectionSelected.emit(section);

//     if (normalized === 'ai') {
//       this.menuService.setSelectedSection('');
//       this.router.navigate(['s/ai']);
//       return;
//     }

//     this.menuService.setSelectedSection(section);

//     // ✅ Preserve open state for next permission rebuild
//     this.prevMobileSubs = this.mobileSidebarItems.flatMap(
//       (mi) => mi.subPermissions
//     );
//   }

//   navigate(item: any) {
//     if (item.route) {
//       this.router.navigate([item.route]);
//     }
//   }

//   ngOnDestroy() {
//     if (this.sub) {
//       this.sub.unsubscribe();
//     }
//   }
// }

//------------------------------------------------------------------------------------//
// import {
//   Component,
//   EventEmitter,
//   OnInit,
//   Output,
//   OnDestroy,
// } from '@angular/core';
// import {
//   SidebarItem,
//   SubPermission,
//   NestedPermission,
// } from '../../constants/constants';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../../services/auth';
// import { MenuService } from '../../services/menu.service';
// import { UiService } from '../../services/ui.service';
// import { Subscription } from 'rxjs';
// import { PermissionsService } from '../../services/permissions.service';

// type RootPermission = SidebarItem;
// type ChildPermission = SubPermission;

// interface MobileSidebarItem {
//   id: number;
//   label: string;
//   section: string;
//   icon: string;
//   route: string;
//   isvisible: boolean;
//   subPermissions: ChildPermission[];
//   isOpen: boolean;
// }

// @Component({
//   selector: 'app-sidenavbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MatIconModule],
//   templateUrl: './sidenavbar.html',
//   styleUrls: ['./sidenavbar.scss'],
// })
// export class Sidenavbar implements OnInit, OnDestroy {
//   navItems: SidebarItem[] = [];
//   selectedSection: string | null = null;
//   private sub!: Subscription;
//   mobileSidebarItems: MobileSidebarItem[] = [];
//   @Output() sectionSelected = new EventEmitter<string>();

//   constructor(
//     private http: HttpClient,
//     private auth: AuthService,
//     private menuService: MenuService,
//     private router: Router,
//     public uiService: UiService,
//     private permissionsService: PermissionsService
//   ) {
//     this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
//       this.selectedSection = null;
//     });
//   }

//   isLoginPage(): boolean {
//     return this.router.url === '/login';
//   }

//   ngOnInit(): void {
//     this.auth.loginState$.subscribe((roleId) => {
//       if (roleId) {
//         this.loadMenu(roleId);
//         this.permissionsService.startPolling(roleId);

//         this.permissionsService.mainPermissions$.subscribe((list) => {
//           this.navItems = this.buildNavItems(list);
//           this.mobileSidebarItems = this.mergeMobileSidebar(this.navItems);
//           this.subscribeFullPermissions();
//         });
//       } else {
//         this.navItems = [];
//         this.mobileSidebarItems = [];
//         this.permissionsService.stopPolling();
//       }
//     });
//   }

//   private loadMenu(roleId: number) {
//     const cache = localStorage.getItem('mainPermissions');
//     if (cache) {
//       try {
//         const cached = JSON.parse(cache) as SidebarItem[];
//         this.navItems = cached.filter((item) => item.isvisible);
//         return;
//       } catch {}
//     }

//     const sub = this.permissionsService.mainPermissions$.subscribe((list) => {
//       if (list?.length) {
//         this.navItems = list.filter((item) => item.isvisible);
//         sub.unsubscribe();
//       }
//     });
//   }

//   private buildNavItems(list: SidebarItem[]): SidebarItem[] {
//     return list
//       .filter((item) => item.isvisible)
//       .map((item) => ({
//         ...item,
//         isOpen: item.isOpen ?? false,
//         subPermissions:
//           item.subPermissions
//             ?.filter((sub) => sub.isvisible)
//             .map((sub) => this.buildSubPermission(sub)) || [],
//       }));
//   }

//   private buildSubPermission(sub: SubPermission): SubPermission {
//     return {
//       ...sub,
//       isOpen: sub.isOpen ?? false,
//       nestedPermissions:
//         sub.nestedPermissions
//           ?.filter((n) => n.isvisible)
//           .map((n) => this.buildNestedPermission(n)) || [],
//     };
//   }

//   private buildNestedPermission(nested: NestedPermission): NestedPermission {
//     return {
//       ...nested,
//       isOpen: nested.isOpen ?? false,
//       nestedPermissions:
//         nested.nestedPermissions
//           ?.filter((c) => c.isvisible)
//           .map((c) => this.buildNestedPermission(c)) || [],
//     };
//   }

//   private subscribeFullPermissions() {
//     this.permissionsService.fullPermissions$.subscribe((fullList) => {
//       this.mobileSidebarItems = this.mergePermissionsRecursive(
//         fullList as RootPermission[],
//         this.mobileSidebarItems
//       );
//     });
//   }

//   private mergeMobileSidebar(newItems: RootPermission[]): MobileSidebarItem[] {
//     return this.mergePermissionsRecursive(newItems, this.mobileSidebarItems);
//   }

//   private mergePermissionsRecursive(
//     newPermissions: RootPermission[],
//     oldItems: MobileSidebarItem[]
//   ): MobileSidebarItem[] {
//     return newPermissions
//       .filter((root) => root.isvisible)
//       .map((root) => {
//         const oldRoot = oldItems.find((o) => o.id === root.id);

//         const mergedChildren: ChildPermission[] = (root.subPermissions || [])
//           .filter((sub) => sub.isvisible)
//           .map((sub) =>
//             this.mergeSubPermissionRecursive(sub, oldRoot?.subPermissions || [])
//           );

//         return {
//           id: root.id,
//           label: root.label,
//           section: root.section,
//           icon: root.icon ?? '',
//           route: root.route ?? '',
//           isvisible: root.isvisible,
//           subPermissions: mergedChildren,
//           isOpen: oldRoot?.isOpen ?? this.selectedSection === root.section,
//         };
//       });
//   }

//   private mergeSubPermissionRecursive(
//     newSub: SubPermission,
//     oldSubs: SubPermission[]
//   ): SubPermission {
//     const oldSub = oldSubs.find((o) => o.id === newSub.id);

//     const mergedNested: NestedPermission[] = (newSub.nestedPermissions || [])
//       .filter((nested) => nested.isvisible)
//       .map((nested) =>
//         this.mergeNestedPermission(nested, oldSub?.nestedPermissions || [])
//       );

//     return {
//       ...newSub,
//       isOpen: oldSub?.isOpen ?? false,
//       nestedPermissions: mergedNested,
//     };
//   }

//   private mergeNestedPermission(
//     newNested: NestedPermission,
//     oldNestedArr: NestedPermission[]
//   ): NestedPermission {
//     const oldNested = oldNestedArr.find((o) => o.id === newNested.id);

//     const mergedChildren: NestedPermission[] = (
//       newNested.nestedPermissions || []
//     ).map((child) =>
//       this.mergeNestedPermission(child, oldNested?.nestedPermissions || [])
//     );

//     return {
//       ...newNested,
//       isOpen: oldNested?.isOpen ?? false,
//       nestedPermissions: mergedChildren,
//     };
//   }

//   selectSection(section: string) {
//     const normalized = section.toLowerCase();

//     if (normalized === 'dashboard') {
//       this.selectedSection = section;
//       this.menuService.setSelectedSection('');
//       this.sectionSelected.emit(section);
//       this.router.navigate(['s/dashboard']);
//       return;
//     }

//     const item = this.mobileSidebarItems.find((mi) => mi.section === section);
//     if (item) {
//       if (this.selectedSection === section) item.isOpen = !item.isOpen;
//       else {
//         this.selectedSection = section;
//         this.mobileSidebarItems.forEach((mi) => (mi.isOpen = false));
//         item.isOpen = true;
//       }
//     }

//     this.sectionSelected.emit(section);

//     if (normalized === 'ai') {
//       this.menuService.setSelectedSection('');
//       this.router.navigate(['s/ai']);
//       return;
//     }

//     this.menuService.setSelectedSection(section);
//   }

//   navigate(item: any) {
//     if (item.route) this.router.navigate([item.route]);
//   }

//   ngOnDestroy() {
//     this.sub?.unsubscribe();
//   }
// }

// import {
//   Component,
//   EventEmitter,
//   OnInit,
//   Output,
//   OnDestroy,
// } from '@angular/core';
// import {
//   SidebarItem,
//   SubPermission,
//   NestedPermission,
// } from '../../constants/constants';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../../services/auth';
// import { MenuService } from '../../services/menu.service';
// import { UiService } from '../../services/ui.service';
// import { Subscription } from 'rxjs';
// import { PermissionsService } from '../../services/permissions.service';

// type RootPermission = SidebarItem;
// type ChildPermission = SubPermission;

// interface MobileSidebarItem {
//   id: number;
//   label: string;
//   section: string;
//   icon: string;
//   route: string;
//   isvisible: boolean;
//   subPermissions: ChildPermission[];
//   isOpen: boolean;
// }

// @Component({
//   selector: 'app-sidenavbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MatIconModule],
//   templateUrl: './sidenavbar.html',
//   styleUrls: ['./sidenavbar.scss'],
// })
// export class Sidenavbar implements OnInit, OnDestroy {
//   navItems: SidebarItem[] = [];
//   selectedSection: string | null = null;
//   private sub!: Subscription;
//   mobileSidebarItems: MobileSidebarItem[] = [];
//   @Output() sectionSelected = new EventEmitter<string>();

//   // Persistent isOpen state for all menus (root, sub, nested)
//   private openStateMap = new Map<number, boolean>();

//   constructor(
//     private http: HttpClient,
//     private auth: AuthService,
//     private menuService: MenuService,
//     private router: Router,
//     public uiService: UiService,
//     private permissionsService: PermissionsService
//   ) {
//     this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
//       this.selectedSection = null;
//     });
//   }

//   isLoginPage(): boolean {
//     return this.router.url === '/login';
//   }

//   ngOnInit(): void {
//     this.auth.loginState$.subscribe((roleId) => {
//       if (roleId) {
//         this.loadMenu(roleId);
//         this.permissionsService.startPolling(roleId);

//         this.permissionsService.mainPermissions$.subscribe((list) => {
//           this.navItems = list.filter((item) => item.isvisible);
//           this.mobileSidebarItems = this.buildMobileHierarchy(this.navItems);
//           this.subscribeFullPermissions();
//         });
//       } else {
//         this.navItems = [];
//         this.mobileSidebarItems = [];
//         this.permissionsService.stopPolling();
//       }
//     });
//   }

//   private loadMenu(roleId: number) {
//     const cache = localStorage.getItem('mainPermissions');
//     if (cache) {
//       try {
//         const cached = JSON.parse(cache) as SidebarItem[];
//         this.navItems = cached.filter((item) => item.isvisible);
//         return;
//       } catch {}
//     }

//     const sub = this.permissionsService.mainPermissions$.subscribe((list) => {
//       if (list?.length) {
//         this.navItems = list.filter((item) => item.isvisible);
//         sub.unsubscribe();
//       }
//     });
//   }

//   private subscribeFullPermissions() {
//     this.permissionsService.fullPermissions$.subscribe((fullList) => {
//       this.mobileSidebarItems = this.buildMobileHierarchy(
//         fullList as RootPermission[]
//       );
//     });
//   }

//   // 🔹 Build the mobile hierarchy recursively using openStateMap
//   private buildMobileHierarchy(list: RootPermission[]): MobileSidebarItem[] {
//     return list.map((root) => {
//       const subPermissions: ChildPermission[] = (root.subPermissions || [])
//         .filter((sub) => sub.isvisible)
//         .map((sub) => this.buildSubRecursive(sub));

//       const isOpen =
//         this.openStateMap.get(root.id) ?? this.selectedSection === root.section;
//       this.openStateMap.set(root.id, isOpen);

//       return {
//         id: root.id,
//         label: root.label,
//         section: root.section,
//         icon: root.icon ?? '',
//         route: root.route ?? '',
//         isvisible: root.isvisible,
//         subPermissions,
//         isOpen,
//       };
//     });
//   }

//   private buildSubRecursive(sub: SubPermission): SubPermission {
//     const nestedPermissions: NestedPermission[] = (sub.nestedPermissions || [])
//       .filter((n) => n.isvisible)
//       .map((n) => this.buildNestedRecursive(n));

//     const isOpen = this.openStateMap.get(sub.id) ?? false;
//     this.openStateMap.set(sub.id, isOpen);

//     return {
//       ...sub,
//       isOpen,
//       nestedPermissions,
//     };
//   }

//   private buildNestedRecursive(nested: NestedPermission): NestedPermission {
//     const nestedPermissions: NestedPermission[] = (
//       nested.nestedPermissions || []
//     )
//       .filter((c) => c.isvisible)
//       .map((c) => this.buildNestedRecursive(c));

//     const isOpen = this.openStateMap.get(nested.id) ?? false;
//     this.openStateMap.set(nested.id, isOpen);

//     return {
//       ...nested,
//       isOpen,
//       nestedPermissions,
//     };
//   }

//   // Toggle a root section
//   selectSection(section: string) {
//     const normalized = section.toLowerCase();

//     if (normalized === 'dashboard') {
//       this.selectedSection = section;
//       this.menuService.setSelectedSection('');
//       this.sectionSelected.emit(section);
//       this.router.navigate(['s/dashboard']);
//       return;
//     }

//     const item = this.mobileSidebarItems.find((mi) => mi.section === section);
//     if (item) {
//       if (this.selectedSection === section) item.isOpen = !item.isOpen;
//       else {
//         this.selectedSection = section;
//         this.mobileSidebarItems.forEach((mi) => (mi.isOpen = false));
//         item.isOpen = true;
//       }
//       this.openStateMap.set(item.id, item.isOpen);
//     }

//     this.sectionSelected.emit(section);

//     if (normalized === 'ai') {
//       this.menuService.setSelectedSection('');
//       this.router.navigate(['s/ai']);
//       return;
//     }

//     this.menuService.setSelectedSection(section);
//   }

//   // Toggle submenus and nested menus
//   toggleSubPermission(sub: SubPermission) {
//     sub.isOpen = !sub.isOpen;
//     this.openStateMap.set(sub.id, sub.isOpen);
//   }

//   toggleNestedPermission(nested: NestedPermission) {
//     nested.isOpen = !nested.isOpen;
//     this.openStateMap.set(nested.id, nested.isOpen);
//   }

//   navigate(item: any) {
//     if (item.route) this.router.navigate([item.route]);
//   }

//   ngOnDestroy() {
//     this.sub?.unsubscribe();
//   }
// }
//------------------------------------------------------------------------------------//
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  SidebarItem,
  SubPermission,
  NestedPermission,
} from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { MenuService } from '../../services/menu.service';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../services/permissions.service';

type RootPermission = SidebarItem;
type ChildPermission = SubPermission;

interface MobileSidebarItem {
  id: number;
  label: string;
  section: string;
  icon: string;
  route: string;
  isvisible: boolean;
  subPermissions: ChildPermission[];
  isOpen: boolean;
}

@Component({
  selector: 'app-sidenavbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidenavbar.html',
  styleUrls: ['./sidenavbar.scss'],
})
export class Sidenavbar implements OnInit, OnDestroy {
  navItems: SidebarItem[] = [];
  mobileSidebarItems: MobileSidebarItem[] = [];
  selectedSection: string | null = null;
  private sub!: Subscription;
  @Output() sectionSelected = new EventEmitter<string>();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private menuService: MenuService,
    private router: Router,
    public uiService: UiService,
    private permissionsService: PermissionsService
  ) {
    this.sub = this.uiService.closeSubsidenav$.subscribe(() => {
      this.selectedSection = null;
    });
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit(): void {
    this.auth.loginState$.subscribe((roleId) => {
      if (roleId) {
        this.loadMenu(roleId);
        this.permissionsService.startPolling(roleId);

        this.permissionsService.mainPermissions$.subscribe((list) => {
          this.navItems = this.buildNavItems(list);
          this.mobileSidebarItems = this.filterVisiblePermissions(
            this.mergeMobileSidebar(this.navItems)
          );
          this.subscribeFullPermissions();
        });
      } else {
        this.navItems = [];
        this.mobileSidebarItems = [];
        this.permissionsService.stopPolling();
      }
    });
  }

  private loadMenu(roleId: number) {
    const cache = localStorage.getItem('mainPermissions');
    if (cache) {
      try {
        const cached = JSON.parse(cache) as SidebarItem[];
        this.navItems = cached.filter((item) => item.isvisible);
        return;
      } catch {}
    }

    const sub = this.permissionsService.mainPermissions$.subscribe((list) => {
      if (list?.length) {
        this.navItems = list.filter((item) => item.isvisible);
        sub.unsubscribe();
      }
    });
  }

  private buildNavItems(list: SidebarItem[]): SidebarItem[] {
    return list
      .filter((item) => item.isvisible)
      .map((item) => ({
        ...item,
        isOpen: item.isOpen ?? false,
        subPermissions:
          item.subPermissions
            ?.filter((sub) => sub.isvisible)
            .map((sub) => this.buildSubPermission(sub)) ?? [],
      }));
  }

  private buildSubPermission(sub: SubPermission): SubPermission {
    return {
      ...sub,
      isOpen: sub.isOpen ?? false,
      nestedPermissions:
        sub.nestedPermissions
          ?.filter((n) => n.isvisible)
          .map((n) => this.buildNestedPermission(n)) ?? [],
    };
  }

  private buildNestedPermission(nested: NestedPermission): NestedPermission {
    return {
      ...nested,
      isOpen: nested.isOpen ?? false,
      nestedPermissions:
        nested.nestedPermissions
          ?.filter((c) => c.isvisible)
          .map((c) => this.buildNestedPermission(c)) ?? [],
    };
  }

  private subscribeFullPermissions() {
    this.permissionsService.fullPermissions$.subscribe((fullList) => {
      const merged = this.mergePermissionsRecursive(
        fullList as RootPermission[],
        this.mobileSidebarItems
      );
      this.mobileSidebarItems = this.filterVisiblePermissions(merged);
    });
  }

  private mergeMobileSidebar(newItems: RootPermission[]): MobileSidebarItem[] {
    return this.mergePermissionsRecursive(newItems, this.mobileSidebarItems);
  }

  private mergePermissionsRecursive(
    newPermissions: RootPermission[],
    oldItems: MobileSidebarItem[]
  ): MobileSidebarItem[] {
    return newPermissions
      .filter((root) => root.isvisible)
      .map((root) => {
        const oldRoot = oldItems.find((o) => o.id === root.id);

        const mergedChildren: ChildPermission[] = (root.subPermissions ?? [])
          .filter((sub) => sub.isvisible)
          .map((sub) =>
            this.mergeSubPermissionRecursive(sub, oldRoot?.subPermissions ?? [])
          );

        return {
          id: root.id,
          label: root.label,
          section: root.section,
          icon: root.icon ?? '',
          route: root.route ?? '',
          isvisible: root.isvisible,
          subPermissions: mergedChildren,
          isOpen: oldRoot?.isOpen ?? this.selectedSection === root.section,
        };
      });
  }

  private mergeSubPermissionRecursive(
    newSub: SubPermission,
    oldSubs: SubPermission[]
  ): SubPermission {
    const oldSub = oldSubs.find((o) => o.id === newSub.id);

    const mergedNested: NestedPermission[] = (
      newSub.nestedPermissions ?? []
    ).map((nested) =>
      this.mergeNestedPermission(nested, oldSub?.nestedPermissions ?? [])
    );

    return {
      ...newSub,
      isOpen: oldSub?.isOpen ?? false,
      nestedPermissions: mergedNested,
    };
  }

  private mergeNestedPermission(
    newNested: NestedPermission,
    oldNestedArr: NestedPermission[]
  ): NestedPermission {
    const oldNested = oldNestedArr.find((o) => o.id === newNested.id);

    const mergedChildren: NestedPermission[] = (
      newNested.nestedPermissions ?? []
    ).map((child) =>
      this.mergeNestedPermission(child, oldNested?.nestedPermissions ?? [])
    );

    return {
      ...newNested,
      isOpen: oldNested?.isOpen ?? false,
      nestedPermissions: mergedChildren,
    };
  }

  private filterVisiblePermissions(
    items: MobileSidebarItem[]
  ): MobileSidebarItem[] {
    return items
      .filter((item) => item.isvisible)
      .map((item) => ({
        ...item,
        subPermissions: this.filterSubPermissions(item.subPermissions),
      }));
  }

  private filterSubPermissions(subs: SubPermission[]): SubPermission[] {
    return (subs ?? [])
      .filter((sub) => sub.isvisible)
      .map((sub) => ({
        ...sub,
        nestedPermissions: this.filterNestedPermissions(sub.nestedPermissions),
      }));
  }

  private filterNestedPermissions(
    nested: NestedPermission[] = []
  ): NestedPermission[] {
    return (nested ?? [])
      .filter((n) => n.isvisible)
      .map((n) => ({
        ...n,
        nestedPermissions: this.filterNestedPermissions(n.nestedPermissions),
      }));
  }

  toggleSubPermission(sub: SubPermission, event: MouseEvent) {
    sub.isOpen = !sub.isOpen;
    event.stopPropagation();
  }

  toggleNestedPermission(nested: NestedPermission, event: MouseEvent) {
    nested.isOpen = !nested.isOpen;
    event.stopPropagation();
  }

  selectSection(section: string) {
    const normalized = section.toLowerCase();

    if (normalized === 'dashboard') {
      this.selectedSection = section;
      this.menuService.setSelectedSection('');
      this.sectionSelected.emit(section);
      this.router.navigate(['s/dashboard']);
      return;
    }

    const item = this.mobileSidebarItems.find((mi) => mi.section === section);
    if (item) {
      if (this.selectedSection === section) item.isOpen = !item.isOpen;
      else {
        this.selectedSection = section;
        this.mobileSidebarItems.forEach((mi) => (mi.isOpen = false));
        item.isOpen = true;
      }
    }

    this.sectionSelected.emit(section);

    if (normalized === 'ai') {
      this.menuService.setSelectedSection('');
      this.router.navigate(['s/ai']);
      return;
    }

    this.menuService.setSelectedSection(section);
  }

  navigate(item: any, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (item.route) this.router.navigate([item.route]);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
