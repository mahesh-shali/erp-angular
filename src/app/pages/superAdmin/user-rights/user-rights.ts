// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// interface User {
//   id: number;
//   name: string;
//   role: string;
//   template: string;
//   company: string;
//   permissions: PermissionGroup[];
// }

// interface PermissionGroup {
//   title: string;
//   color: string;
//   permissions: Permission[];
// }

// interface Permission {
//   label: string;
//   canread: boolean;
//   canwrite: boolean;
//   canput: boolean;
//   candelete: boolean;
//   isvisible: boolean;
//   ishidden: boolean;
//   isrestricted: boolean;
// }

// @Component({
//   selector: 'app-user-rights',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './user-rights.html',
//   styleUrl: './user-rights.scss',
// })
// export class UserRights implements OnInit {
//   users: User[] = [];
//   ngOnInit(): void {
//     permissionGroups: PermissionGroup[] = [
//     {
//       title: 'CATALOG',
//       color: 'bg-blue-500',
//       permissions: [
//         {
//           label: 'General Permissions',
//           canread: true,
//           canwrite: true,
//           canput: false,
//           candelete: false,
//           isvisible: true,
//           ishidden: false,
//           isrestricted: false,
//         },
//       ],
//     },
//     {
//       title: 'INVENTORY',
//       color: 'bg-red-500',
//       permissions: [
//         {
//           label: 'General Permissions',
//           canread: true,
//           canwrite: false,
//           canput: false,
//           candelete: false,
//           isvisible: true,
//           ishidden: false,
//           isrestricted: false,
//         },
//       ],
//     },
//     {
//       title: 'INVENTORY',
//       color: 'bg-red-500',
//       permissions: [
//         {
//           label: 'General Permissions',
//           canread: true,
//           canwrite: false,
//           canput: false,
//           candelete: false,
//           isvisible: true,
//           ishidden: false,
//           isrestricted: false,
//         },
//       ],
//     },
//     {
//       title: 'INVENTORY',
//       color: 'bg-red-500',
//       permissions: [
//         {
//           label: 'General Permissions',
//           canread: true,
//           canwrite: false,
//           canput: false,
//           candelete: false,
//           isvisible: true,
//           ishidden: false,
//           isrestricted: false,
//         },
//       ],
//     },
//     {
//       title: 'INVENTORY',
//       color: 'bg-red-500',
//       permissions: [
//         {
//           label: 'General Permissions',
//           canread: true,
//           canwrite: false,
//           canput: false,
//           candelete: false,
//           isvisible: true,
//           ishidden: false,
//           isrestricted: false,
//         },
//       ],
//     },
//     {
//       title: 'INVENTORY',
//       color: 'bg-red-500',
//       permissions: [
//         {
//           label: 'General Permissions',
//           canread: true,
//           canwrite: false,
//           canput: false,
//           candelete: false,
//           isvisible: true,
//           ishidden: false,
//           isrestricted: false,
//         },
//       ],
//     },
//     {
//       title: 'INVENTORY',
//       color: 'bg-red-500',
//       permissions: [
//         {
//           label: 'General Permissions',
//           canread: true,
//           canwrite: false,
//           canput: false,
//           candelete: false,
//           isvisible: true,
//           ishidden: false,
//           isrestricted: false,
//         },
//       ],
//     },
//   ];

//   users: User[] = [
//     {
//       id: 106662,
//       name: 'Test Employee',
//       role: 'Employee',
//       template: 'Custom',
//       company: 'Ace It 88',
//       permissions: this.permissionGroups,
//     },
//     {
//       id: 106663,
//       name: 'Manager Mike',
//       role: 'Manager',
//       template: 'Standard',
//       company: '3TimeWinner',
//       permissions: this.permissionGroups,
//     },
//     {
//       id: 106664,
//       name: 'Admin Alice',
//       role: 'Admin',
//       template: 'Full',
//       company: 'Amazon DE',
//       permissions: this.permissionGroups,
//     },
//   ];
//     this.updateFilteredUsers();
//   }
//   user = {
//     id: 106662,
//     name: 'test test',
//     role: 'Employee',
//     template: 'Custom',
//   };

//   companies = [
//     'All',
//     '3TimeWinner',
//     'Ace It 88',
//     'Amazon DE',
//     'Angry Bee',
//     'Another Test Company',
//     'BigCommerce',
//     'Canada',
//     'Chewy Via DSCO',
//   ];
//   // selectedCompanies: string[] = ['All', 'Ace It 88'];
//   selectedCompany: string = 'All';
//   roles = ['Employee', 'Manager', 'Admin'];
//   selectedRole: string = '';

//   selectedUserId: number | null = null;
//   filteredUsers: User[] = [];

//   // Permission groups

//   get currentPermissions(): PermissionGroup[] {
//     const user = this.users.find((u) => u.id === this.selectedUserId);
//     return user ? user.permissions : [];
//   }

//   updateFilteredUsers() {
//     this.filteredUsers = this.users.filter((user) => {
//       const matchCompany =
//         this.selectedCompany === 'All' || user.company === this.selectedCompany;
//       const matchRole = !this.selectedRole || user.role === this.selectedRole;
//       return matchCompany && matchRole;
//     });
//     // Reset selected user if it no longer exists in filtered
//     if (!this.filteredUsers.some((u) => u.id === this.selectedUserId)) {
//       this.selectedUserId = null;
//     }
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// interface Permission {
//   label: string;
//   canread: boolean;
//   canwrite: boolean;
//   canput: boolean;
//   candelete: boolean;
//   isvisible: boolean;
//   ishidden: boolean;
//   isrestricted: boolean;
// }

// interface NestedPermissionGroup {
//   label: string;
//   option: string;
//   route: string;
//   permissions: Permission[];
// }

// interface SubPermissionGroup {
//   label: string;
//   option: string;
//   route: string;
//   permissions: Permission[];
//   nestedPermissions: NestedPermissionGroup[];
// }

// interface PermissionGroup {
//   title: string;
//   color: string;
//   permissions: Permission[];
//   subPermissions: SubPermissionGroup[];
// }

// interface Company {
//   id: number;
//   name: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// interface User {
//   id: number;
//   name: string;
//   roleId: number;
//   companyId: number;
//   permissions: PermissionGroup[];
// }

// @Component({
//   selector: 'app-user-rights',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './user-rights.html',
//   styleUrls: ['./user-rights.scss'],
// })
// export class UserRights implements OnInit {
//   companies: Company[] = [];
//   roles: Role[] = [];
//   users: User[] = [];

//   selectedCompanyId: number | null = null;
//   selectedRoleId: number | null = null;
//   selectedUserId: number | null = null;

//   filteredUsers: User[] = [];
//   private apiUrl = environment.apiUrl;

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchAllPermissions();
//   }

//   fetchAllPermissions() {
//     this.http
//       .get<any>(`${this.apiUrl}/rights/rights`, { withCredentials: true })
//       .subscribe((res) => {
//         // Convert companies dictionary to array
//         this.companies = Object.keys(res.companies).map((k) => ({
//           id: +k,
//           name: res.companies[k],
//         }));

//         this.roles = res.roles;

//         // Map users to include companyId
//         this.users = res.users.map((u: any) => ({
//           ...u,
//           companyId: this.companies.find((c) => c.name === u.company)?.id ?? 0,
//         }));

//         this.updateFilteredUsers();
//       });
//   }

//   updateFilteredUsers() {
//     this.filteredUsers = this.users.filter((u) => {
//       const companyMatch =
//         !this.selectedCompanyId || u.companyId === this.selectedCompanyId;
//       const roleMatch =
//         !this.selectedRoleId || u.roleId === this.selectedRoleId;
//       return companyMatch && roleMatch;
//     });

//     if (!this.filteredUsers.some((u) => u.id === this.selectedUserId)) {
//       this.selectedUserId = null;
//     }
//   }

//   get currentPermissions(): PermissionGroup[] {
//     const user = this.users.find((u) => u.id === this.selectedUserId);
//     return user?.permissions ?? [];
//   }
// }

// //-----------------------------------------------//
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// interface Permission {
//   label: string;
//   canread: boolean;
//   canwrite: boolean;
//   canput: boolean;
//   candelete: boolean;
//   isvisible: boolean;
//   ishidden: boolean;
//   isrestricted: boolean;
// }

// interface NestedPermissionGroup {
//   label: string;
//   option: string;
//   route: string;
//   permissions: Permission[];
// }

// interface SubPermissionGroup {
//   label: string;
//   option: string;
//   route: string;
//   permissions: Permission[];
//   nestedPermissions: NestedPermissionGroup[];
// }

// interface PermissionGroup {
//   title: string;
//   color: string;
//   permissions: Permission[];
//   subPermissions: SubPermissionGroup[];
// }

// interface Company {
//   id: number;
//   name: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// interface User {
//   id: number;
//   name: string;
//   roleId: number;
//   companyId: number;
//   permissions: PermissionGroup[];
// }

// @Component({
//   selector: 'app-user-rights',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './user-rights.html',
//   styleUrls: ['./user-rights.scss'],
// })
// export class UserRights implements OnInit {
//   companies: Company[] = [];
//   roles: Role[] = [];
//   users: User[] = [];

//   selectedCompanyId: number | null = null;
//   selectedRoleId: number | null = null;
//   selectedUserId: number | null = null;
//   selectedMainModule: string | null = null;
//   selectedSubModule: string | null = null;
//   selectedNestedModule: string | null = null;

//   availableUsers: any[] = [];
//   availableMainModules: any[] = [];
//   availableSubModules: any[] = [];
//   availableNestedModules: any[] = [];
//   filteredPermissions: any[] = [];

//   filteredUsers: User[] = [];
//   private apiUrl = environment.apiUrl;

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchAllPermissions();
//   }

//   fetchAllPermissions() {
//     this.http
//       .get<any>(`${this.apiUrl}/rights/rights`, { withCredentials: true })
//       .subscribe((res) => {
//         // Convert companies dictionary to array
//         this.companies = Object.keys(res.companies).map((k) => ({
//           id: +k,
//           name: res.companies[k],
//         }));

//         this.roles = res.roles;

//         // Map users to include companyId
//         this.users = res.users.map((u: any) => ({
//           ...u,
//           companyId: this.companies.find((c) => c.name === u.company)?.id ?? 0,
//         }));

//         this.updateFilteredUsers();
//       });
//   }

//   updateFilteredUsers() {
//     this.filteredUsers = this.users.filter((u) => {
//       const companyMatch =
//         !this.selectedCompanyId || u.companyId === this.selectedCompanyId;
//       const roleMatch =
//         !this.selectedRoleId || u.roleId === this.selectedRoleId;
//       return companyMatch && roleMatch;
//     });

//     if (!this.filteredUsers.some((u) => u.id === this.selectedUserId)) {
//       this.selectedUserId = null;
//     }
//   }

//   onCompanyChange() {
//     this.selectedRoleId = null;
//     this.selectedUserId = null;
//     this.updateFilteredUsers();
//   }

//   onRoleChange() {
//     this.selectedUserId = null;
//     this.updateFilteredUsers();
//   }

//   get currentPermissions(): PermissionGroup[] {
//     const user = this.users.find((u) => u.id === this.selectedUserId);
//     return user?.permissions ?? [];
//   }
// }
// //-----------------------------------------//
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// interface Permission {
//   id: number;
//   label: string;
//   canread: boolean;
//   canwrite: boolean;
//   canput: boolean;
//   candelete: boolean;
//   isvisible: boolean;
//   ishidden: boolean;
//   isrestricted: boolean;
// }

// interface NestedPermissionGroup {
//   id: number;
//   label: string;
//   option: string;
//   route: string;
//   permissions: Permission[];
// }

// interface SubPermissionGroup {
//   id: number;
//   label: string;
//   option: string;
//   route: string;
//   permissions: Permission[];
//   nestedPermissions: NestedPermissionGroup[];
// }

// interface PermissionGroup {
//   id: number;
//   title: string;
//   color: string;
//   permissions: Permission[];
//   subPermissions: SubPermissionGroup[];
// }

// interface Company {
//   id: number;
//   name: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// interface User {
//   id: number;
//   name: string;
//   roleId: number;
//   companyId: number;
//   permissions: PermissionGroup[];
// }

// @Component({
//   selector: 'app-user-rights',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './user-rights.html',
//   styleUrls: ['./user-rights.scss'],
// })
// export class UserRights implements OnInit {
//   companies: Company[] = [];
//   roles: Role[] = [];
//   users: User[] = [];

//   selectedCompanyId: number | null = null;
//   selectedRoleId: number | null = null;
//   selectedUserId: number | null = null;

//   availableRoles: Role[] = [];
//   availableUsers: User[] = [];
//   availableMainModules: PermissionGroup[] = [];
//   availableSubModules: SubPermissionGroup[] = [];
//   availableNestedModules: NestedPermissionGroup[] = [];

//   selectedMainModule: PermissionGroup | null = null;
//   selectedSubModule: SubPermissionGroup | null = null;
//   selectedNestedModule: NestedPermissionGroup | null = null;

//   private apiUrl = environment.apiUrl;
//   selectedMainModuleId: number | null;
//   selectedSubModuleId: number | null;

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     // this.initializePermissions();
//     this.fetchAllPermissions();
//   }
//   // initializePermissions() {
//   //   if (!this.selectedUserId) return;

//   //   const defaultPermissions = {
//   //     canread: false,
//   //     canwrite: false,
//   //     canput: false,
//   //     candelete: false,
//   //     isvisible: false,
//   //     ishidden: false,
//   //     isrestricted: false,
//   //   };

//   //   // Main Modules
//   //   this.availableMainModules.forEach((m) => {
//   //     if (!m.permissions || m.permissions.length === 0) {
//   //       m.permissions = [{ ...defaultPermissions, label: m.title }];
//   //     }

//   //     // Sub Modules
//   //     m.subPermissions?.forEach((s) => {
//   //       if (!s.permissions || s.permissions.length === 0) {
//   //         s.permissions = [{ ...defaultPermissions, label: s.option }];
//   //       }

//   //       // Nested Modules
//   //       s.nestedPermissions?.forEach((n) => {
//   //         if (!n.permissions || n.permissions.length === 0) {
//   //           n.permissions = [{ ...defaultPermissions, label: n.option }];
//   //         }
//   //       });
//   //     });
//   //   });
//   // }

//   private createDefaultPermission(label: string): Permission {
//     return {
//       id: 0, // <-- backend will replace with actual module ID later
//       label,
//       canread: false,
//       canwrite: false,
//       canput: false,
//       candelete: false,
//       isvisible: false,
//       ishidden: false,
//       isrestricted: false,
//     };
//   }

//   private createDefaultPermissionForModule(
//     moduleId: number,
//     label: string
//   ): Permission {
//     return {
//       id: moduleId,
//       label,
//       canread: false,
//       canwrite: false,
//       canput: false,
//       candelete: false,
//       isvisible: false,
//       ishidden: false,
//       isrestricted: false,
//     };
//   }

//   // initializePermissions() {
//   //   if (this.selectedMainModule) {
//   //     if (!this.selectedMainModule.permissions?.length) {
//   //       this.selectedMainModule.permissions = [
//   //         this.createDefaultPermission(this.selectedMainModule.title),
//   //       ];
//   //     }
//   //   }

//   //   if (this.selectedSubModule) {
//   //     if (!this.selectedSubModule.permissions?.length) {
//   //       this.selectedSubModule.permissions = [
//   //         this.createDefaultPermission(this.selectedSubModule.option),
//   //       ];
//   //     }
//   //   }

//   //   if (this.selectedNestedModule) {
//   //     if (!this.selectedNestedModule.permissions?.length) {
//   //       this.selectedNestedModule.permissions = [
//   //         this.createDefaultPermission(this.selectedNestedModule.option),
//   //       ];
//   //     }
//   //   }
//   // }
//   private initializePermissions() {
//     if (
//       this.selectedMainModule &&
//       !this.selectedMainModule.permissions?.length
//     ) {
//       this.selectedMainModule.permissions = [
//         this.createDefaultPermission(this.selectedMainModule.title),
//       ];
//     }
//     if (this.selectedSubModule && !this.selectedSubModule.permissions?.length) {
//       this.selectedSubModule.permissions = [
//         this.createDefaultPermission(this.selectedSubModule.option),
//       ];
//     }
//     if (
//       this.selectedNestedModule &&
//       !this.selectedNestedModule.permissions?.length
//     ) {
//       this.selectedNestedModule.permissions = [
//         this.createDefaultPermission(this.selectedNestedModule.option),
//       ];
//     }
//   }

//   // fetchAllPermissions() {
//   //   this.http
//   //     .get<any>(`${this.apiUrl}/rights/rights`, { withCredentials: true })
//   //     .subscribe((res) => {
//   //       // Companies array
//   //       this.companies = Object.keys(res.companies).map((k) => ({
//   //         id: +k,
//   //         name: res.companies[k],
//   //       }));

//   //       this.roles = res.roles;

//   //       // Users array
//   //       this.users = res.users.map((u: any) => ({
//   //         ...u,
//   //         companyId:
//   //           this.companies.find((c: Company) => c.name === u.company)?.id ?? 0,
//   //       }));
//   //     });
//   // }
//   // fetchAllPermissions() {
//   //   this.http
//   //     .get<any>(`${this.apiUrl}/rights/rights`, { withCredentials: true })
//   //     .subscribe((res) => {
//   //       // ------------------ Companies ------------------
//   //       this.companies = Object.keys(res.companies).map((k) => ({
//   //         id: +k,
//   //         name: res.companies[k],
//   //       }));

//   //       // ------------------ Roles ------------------
//   //       this.roles = res.roles;

//   //       // ------------------ Users ------------------
//   //       this.users = res.users.map((u: any) => {
//   //         const companyId =
//   //           this.companies.find((c: Company) => c.name === u.company)?.id ?? 0;

//   //         // Map permissions with IDs
//   //         const permissions: PermissionGroup[] = (u.permissions || []).map(
//   //           (m: any) => ({
//   //             id: m.id, // Main module ID
//   //             title: m.title,
//   //             color: m.color,
//   //             permissions: m.permissions?.map((p: any) => ({ ...p })) || [],
//   //             subPermissions: (m.subPermissions || []).map((s: any) => ({
//   //               id: s.id, // Sub module ID
//   //               label: s.label,
//   //               option: s.option,
//   //               route: s.route,
//   //               permissions: s.permissions?.map((p: any) => ({ ...p })) || [],
//   //               nestedPermissions: (s.nestedPermissions || []).map(
//   //                 (n: any) => ({
//   //                   id: n.id, // Nested module ID
//   //                   label: n.label,
//   //                   option: n.option,
//   //                   route: n.route,
//   //                   permissions:
//   //                     n.permissions?.map((p: any) => ({ ...p })) || [],
//   //                 })
//   //               ),
//   //             })),
//   //           })
//   //         );

//   //         return {
//   //           ...u,
//   //           companyId,
//   //           permissions,
//   //         };
//   //       });
//   //     });
//   // }
//   fetchAllPermissions() {
//     this.http
//       .get<any>(`${this.apiUrl}/rights/rights`, { withCredentials: true })
//       .subscribe((res) => {
//         // Companies
//         this.companies = Object.keys(res.companies).map((k) => ({
//           id: +k,
//           name: res.companies[k],
//         }));

//         // Roles
//         this.roles = res.roles;

//         // Users
//         this.users = res.users.map((u: any) => {
//           const companyId =
//             this.companies.find((c: Company) => c.name === u.company)?.id ?? 0;

//           const permissions: PermissionGroup[] = (u.permissions || []).map(
//             (m: any) => ({
//               id: m.id,
//               title: m.title,
//               color: m.color,
//               permissions: m.permissions?.map((p: any) => ({ ...p })) || [],
//               subPermissions: (m.subPermissions || []).map((s: any) => ({
//                 id: s.id,
//                 label: s.label,
//                 option: s.option,
//                 route: s.route,
//                 permissions: s.permissions?.map((p: any) => ({ ...p })) || [],
//                 nestedPermissions: (s.nestedPermissions || []).map(
//                   (n: any) => ({
//                     id: n.id,
//                     label: n.label,
//                     option: n.option,
//                     route: n.route,
//                     permissions:
//                       n.permissions?.map((p: any) => ({ ...p })) || [],
//                   })
//                 ),
//               })),
//             })
//           );

//           return {
//             ...u,
//             companyId,
//             permissions,
//           };
//         });
//       });
//   }

//   // ------------------ FILTER HANDLERS ------------------

//   onCompanySelect() {
//     this.resetBelow('company');
//     if (this.selectedCompanyId) {
//       this.availableRoles = this.roles;
//     }
//   }

//   onRoleSelect() {
//     this.resetBelow('role');
//     if (!this.selectedCompanyId) {
//       alert('Please select a company first.');
//       this.selectedRoleId = null;
//       return;
//     }

//     this.availableUsers = this.users.filter(
//       (u) =>
//         u.roleId === this.selectedRoleId &&
//         u.companyId === this.selectedCompanyId
//     );
//   }

//   // onUserSelect() {
//   //   this.resetBelow('user');
//   //   if (!this.selectedRoleId) {
//   //     alert('Please select a role first.');
//   //     this.selectedUserId = null;
//   //     return;
//   //   }

//   //   const user = this.users.find((u) => u.id === this.selectedUserId);
//   //   this.availableMainModules = user?.permissions || [];
//   // }
//   onUserSelect() {
//     this.resetBelow('user');

//     if (!this.selectedRoleId) {
//       alert('Please select a role first.');
//       this.selectedUserId = null;
//       return;
//     }

//     const user = this.users.find((u) => u.id === this.selectedUserId);
//     if (!user) return;

//     // If user has no permissions, create default permissions for all main modules
//     if (!user.permissions || user.permissions.length === 0) {
//       user.permissions = this.availableMainModules.map((m) => ({
//         id: m.id,
//         title: m.title,
//         color: m.color,
//         permissions: [this.createDefaultPermissionForModule(m.id, m.title)],
//         subPermissions: (m.subPermissions || []).map((s) => ({
//           id: s.id,
//           label: s.label,
//           option: s.option,
//           route: s.route,
//           permissions: [this.createDefaultPermissionForModule(s.id, s.option)],
//           nestedPermissions: (s.nestedPermissions || []).map((n) => ({
//             id: n.id,
//             label: n.label,
//             option: n.option,
//             route: n.route,
//             permissions: [
//               this.createDefaultPermissionForModule(n.id, n.option),
//             ],
//           })),
//         })),
//       }));
//     }

//     this.availableMainModules = user.permissions;
//   }

//   onMainModuleSelect() {
//     this.resetBelow('mainModule');
//     if (!this.selectedUserId) {
//       alert('Please select a user first.');
//       this.selectedMainModule = null;

//       return;
//     }
//     this.availableSubModules = this.selectedMainModule?.subPermissions || [];
//     this.selectedMainModuleId = this.selectedMainModule?.id ?? null;
//     this.initializePermissions();
//   }

//   onSubModuleSelect() {
//     this.resetBelow('subModule');
//     if (!this.selectedMainModule) {
//       alert('Please select a main module first.');
//       this.selectedSubModule = null;
//       return;
//     }
//     this.availableNestedModules =
//       this.selectedSubModule?.nestedPermissions || [];
//     this.selectedSubModuleId = this.selectedSubModule?.id ?? null;
//     this.initializePermissions();
//   }
//   onNestedModuleSelect() {
//     if (!this.selectedNestedModule) return;
//     this.initializePermissions();
//   }

//   // user-rights.ts
//   // onPermissionChange(
//   //   module: any,
//   //   level: 'main' | 'sub' | 'nested',
//   //   perm: Permission
//   // ) {
//   //   if (!this.selectedUserId || !this.selectedRoleId || !this.selectedCompanyId)
//   //     return;

//   //   const payload: any = {
//   //     orgId: this.selectedCompanyId,
//   //     userId: this.selectedUserId,
//   //     roleId: this.selectedRoleId,
//   //     canread: perm.canread,
//   //     canwrite: perm.canwrite,
//   //     canput: perm.canput,
//   //     candelete: perm.candelete,
//   //     isvisible: perm.isvisible,
//   //     ishidden: perm.ishidden,
//   //     isrestricted: perm.isrestricted,
//   //   };

//   //   if (level === 'main') payload.sidenavbarId = module.id;
//   //   if (level === 'sub') payload.subsidenavbarId = module.id;
//   //   if (level === 'nested') payload.nestsidenavbarId = module.id;

//   //   this.http
//   //     .post(`${this.apiUrl}/rights/save-rights`, payload, {
//   //       withCredentials: true,
//   //     })
//   //     .subscribe({
//   //       next: () => console.log(`Permission updated: ${level}`, payload),
//   //       error: (err) => console.error('Failed to update permission', err),
//   //     });
//   // }

//   onPermissionChange(level: 'main' | 'sub' | 'nested') {
//     if (!this.selectedUserId || !this.selectedRoleId || !this.selectedCompanyId)
//       return;

//     let payloads: any[] = [];

//     // // ---------------- Main Module ----------------
//     // if (level === 'main' && this.selectedMainModule) {
//     //   this.selectedMainModule.permissions.forEach((perm) => {
//     //     // <-- Replace the old payload here with the corrected one:
//     //     payloads.push({
//     //       orgId: this.selectedCompanyId,
//     //       userId: this.selectedUserId,
//     //       roleId: this.selectedRoleId,
//     //       SidenavbarId: perm.id,
//     //       canRead: perm.canread,
//     //       canWrite: perm.canwrite,
//     //       canPut: perm.canput,
//     //       canDelete: perm.candelete,
//     //       isVisible: perm.isvisible,
//     //       isHidden: perm.ishidden,
//     //       isRestricted: perm.isrestricted,
//     //     });
//     //   });
//     // }

//     // // ---------------- Sub Module ----------------
//     // if (level === 'sub' && this.selectedSubModule) {
//     //   this.selectedSubModule.permissions.forEach((perm) => {
//     //     payloads.push({
//     //       orgId: this.selectedCompanyId,
//     //       userId: this.selectedUserId,
//     //       roleId: this.selectedRoleId,
//     //       SubSidenavbarId: this.selectedSubModule?.id,
//     //       canRead: perm.canread,
//     //       canWrite: perm.canwrite,
//     //       canPut: perm.canput,
//     //       canDelete: perm.candelete,
//     //       isVisible: perm.isvisible,
//     //       isHidden: perm.ishidden,
//     //       isRestricted: perm.isrestricted,
//     //     });
//     //   });
//     // }

//     // // ---------------- Nested Module ----------------
//     // if (level === 'nested' && this.selectedNestedModule) {
//     //   this.selectedNestedModule.permissions.forEach((perm) => {
//     //     payloads.push({
//     //       orgId: this.selectedCompanyId,
//     //       userId: this.selectedUserId,
//     //       roleId: this.selectedRoleId,
//     //       NestSidenavbarId: this.selectedNestedModule?.id,
//     //       canRead: perm.canread,
//     //       canWrite: perm.canwrite,
//     //       canPut: perm.canput,
//     //       canDelete: perm.candelete,
//     //       isVisible: perm.isvisible,
//     //       isHidden: perm.ishidden,
//     //       isRestricted: perm.isrestricted,
//     //     });
//     //   });
//     // }
//     // ---------------- Main Module ----------------
//     if (level === 'main' && this.selectedMainModule) {
//       if (this.selectedMainModule.permissions.length === 0) {
//         // user has no permissions → still send SidenavbarId using module id
//         payloads.push({
//           orgId: this.selectedCompanyId,
//           userId: this.selectedUserId,
//           roleId: this.selectedRoleId,
//           SidenavbarId: this.selectedMainModule.id, // Parent module id
//           canRead: false,
//           canWrite: false,
//           canPut: false,
//           canDelete: false,
//           isVisible: false,
//           isHidden: false,
//           isRestricted: false,
//         });
//       } else {
//         this.selectedMainModule.permissions.forEach((perm) => {
//           payloads.push({
//             orgId: this.selectedCompanyId,
//             userId: this.selectedUserId,
//             roleId: this.selectedRoleId,
//             SidenavbarId: perm.id, // Use permission's id
//             canRead: perm.canread,
//             canWrite: perm.canwrite,
//             canPut: perm.canput,
//             canDelete: perm.candelete,
//             isVisible: perm.isvisible,
//             isHidden: perm.ishidden,
//             isRestricted: perm.isrestricted,
//           });
//         });
//       }
//     }

//     // ---------------- Sub Module ----------------
//     if (level === 'sub' && this.selectedSubModule) {
//       if (this.selectedSubModule.permissions.length === 0) {
//         payloads.push({
//           orgId: this.selectedCompanyId,
//           userId: this.selectedUserId,
//           roleId: this.selectedRoleId,
//           SubSidenavbarId: this.selectedSubModule.id, // Parent module id
//           canRead: false,
//           canWrite: false,
//           canPut: false,
//           canDelete: false,
//           isVisible: false,
//           isHidden: false,
//           isRestricted: false,
//         });
//       } else {
//         this.selectedSubModule.permissions.forEach((perm) => {
//           payloads.push({
//             orgId: this.selectedCompanyId,
//             userId: this.selectedUserId,
//             roleId: this.selectedRoleId,
//             SubSidenavbarId: perm.id, // Use permission's id
//             canRead: perm.canread,
//             canWrite: perm.canwrite,
//             canPut: perm.canput,
//             canDelete: perm.candelete,
//             isVisible: perm.isvisible,
//             isHidden: perm.ishidden,
//             isRestricted: perm.isrestricted,
//           });
//         });
//       }
//     }

//     // ---------------- Nested Module ----------------
//     if (level === 'nested' && this.selectedNestedModule) {
//       if (this.selectedNestedModule.permissions.length === 0) {
//         payloads.push({
//           orgId: this.selectedCompanyId,
//           userId: this.selectedUserId,
//           roleId: this.selectedRoleId,
//           NestSidenavbarId: this.selectedNestedModule.id, // Parent module id
//           canRead: false,
//           canWrite: false,
//           canPut: false,
//           canDelete: false,
//           isVisible: false,
//           isHidden: false,
//           isRestricted: false,
//         });
//       } else {
//         this.selectedNestedModule.permissions.forEach((perm) => {
//           payloads.push({
//             orgId: this.selectedCompanyId,
//             userId: this.selectedUserId,
//             roleId: this.selectedRoleId,
//             NestSidenavbarId: perm.id, // Use permission's id
//             canRead: perm.canread,
//             canWrite: perm.canwrite,
//             canPut: perm.canput,
//             canDelete: perm.candelete,
//             isVisible: perm.isvisible,
//             isHidden: perm.ishidden,
//             isRestricted: perm.isrestricted,
//           });
//         });
//       }
//     }

//     // Send all at once
//     this.http
//       .post(`${this.apiUrl}/rights/save-rights`, payloads, {
//         withCredentials: true,
//       })
//       .subscribe({
//         next: () => console.log(`Permissions saved: ${level}`, payloads),
//         error: (err) => console.error('Failed to save permissions', err),
//       });
//   }

//   // Reset selections below a certain level
//   resetBelow(level: string) {
//     switch (level) {
//       case 'company':
//         this.selectedRoleId = null;
//         this.availableRoles = [];
//         break;
//       case 'role':
//         this.selectedUserId = null;
//         this.availableUsers = [];
//         break;
//       case 'user':
//         this.selectedMainModule = null;
//         this.availableMainModules = [];
//         break;
//       case 'mainModule':
//         this.selectedSubModule = null;
//         this.availableSubModules = [];
//         break;
//       case 'subModule':
//         this.selectedNestedModule = null;
//         this.availableNestedModules = [];
//         break;
//     }
//   }
// }
//---------------------------------------------------//
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Permission {
  id: number;
  label: string;
  canread: boolean;
  canwrite: boolean;
  canput: boolean;
  candelete: boolean;
  isvisible: boolean;
  ishidden: boolean;
  isrestricted: boolean;
}

interface NestedPermissionGroup {
  id: number;
  label: string;
  option: string;
  route: string;
  permissions: Permission[];
}

interface SubPermissionGroup {
  id: number;
  label: string;
  option: string;
  route: string;
  permissions: Permission[];
  nestedPermissions: NestedPermissionGroup[];
}

interface PermissionGroup {
  id: number;
  title: string;
  color: string;
  permissions: Permission[];
  subPermissions: SubPermissionGroup[];
}

interface Company {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  roleId: number;
  companyId: number;
  permissions: PermissionGroup[];
}

@Component({
  selector: 'app-user-rights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-rights.html',
  styleUrls: ['./user-rights.scss'],
})
export class UserRights implements OnInit {
  companies: Company[] = [];
  roles: Role[] = [];
  users: User[] = [];

  selectedCompanyId: number | null = null;
  selectedRoleId: number | null = null;
  selectedUserId: number | null = null;

  availableRoles: Role[] = [];
  availableUsers: User[] = [];
  availableMainModules: PermissionGroup[] = [];
  availableSubModules: SubPermissionGroup[] = [];
  availableNestedModules: NestedPermissionGroup[] = [];

  selectedMainModule: PermissionGroup | null = null;
  selectedSubModule: SubPermissionGroup | null = null;
  selectedNestedModule: NestedPermissionGroup | null = null;

  private apiUrl = environment.apiUrl;
  selectedMainModuleId: number | null;
  selectedSubModuleId: number | null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllPermissions();
  }

  // ------------------ HELPERS ------------------

  private createDefaultPermissionForModule(
    moduleId: number,
    label: string
  ): Permission {
    return {
      id: moduleId,
      label,
      canread: false,
      canwrite: false,
      canput: false,
      candelete: false,
      isvisible: false,
      ishidden: false,
      isrestricted: false,
    };
  }

  private initializePermissions() {
    if (
      this.selectedMainModule &&
      !this.selectedMainModule.permissions?.length
    ) {
      this.selectedMainModule.permissions = [
        this.createDefaultPermissionForModule(
          this.selectedMainModule.id,
          this.selectedMainModule.title
        ),
      ];
    }

    if (this.selectedSubModule && !this.selectedSubModule.permissions?.length) {
      this.selectedSubModule.permissions = [
        this.createDefaultPermissionForModule(
          this.selectedSubModule.id,
          this.selectedSubModule.option
        ),
      ];
    }

    if (
      this.selectedNestedModule &&
      !this.selectedNestedModule.permissions?.length
    ) {
      this.selectedNestedModule.permissions = [
        this.createDefaultPermissionForModule(
          this.selectedNestedModule.id,
          this.selectedNestedModule.option
        ),
      ];
    }
  }

  // ------------------ FETCH PERMISSIONS ------------------

  fetchAllPermissions() {
    this.http
      .get<any>(`${this.apiUrl}/rights/rights`, { withCredentials: true })
      .subscribe((res) => {
        // Companies
        this.companies = Object.keys(res.companies).map((k) => ({
          id: +k,
          name: res.companies[k],
        }));

        // Roles
        this.roles = res.roles;

        // Users
        this.users = res.users.map((u: any) => {
          const companyId =
            this.companies.find((c: Company) => c.name === u.company)?.id ?? 0;

          const permissions: PermissionGroup[] = (u.permissions || []).map(
            (m: any) => ({
              id: m.id,
              title: m.title,
              color: m.color,
              permissions: m.permissions?.map((p: any) => ({ ...p })) || [],
              subPermissions: (m.subPermissions || []).map((s: any) => ({
                id: s.id,
                label: s.label,
                option: s.option,
                route: s.route,
                permissions: s.permissions?.map((p: any) => ({ ...p })) || [],
                nestedPermissions: (s.nestedPermissions || []).map(
                  (n: any) => ({
                    id: n.id,
                    label: n.label,
                    option: n.option,
                    route: n.route,
                    permissions:
                      n.permissions?.map((p: any) => ({ ...p })) || [],
                  })
                ),
              })),
            })
          );

          return {
            ...u,
            companyId,
            permissions,
          };
        });
      });
  }

  // ------------------ FILTER HANDLERS ------------------

  onCompanySelect() {
    this.resetBelow('company');
    if (this.selectedCompanyId) {
      this.availableRoles = this.roles;
    }
  }

  onRoleSelect() {
    this.resetBelow('role');
    if (!this.selectedCompanyId) {
      alert('Please select a company first.');
      this.selectedRoleId = null;
      return;
    }

    this.availableUsers = this.users.filter(
      (u) =>
        u.roleId === this.selectedRoleId &&
        u.companyId === this.selectedCompanyId
    );
  }

  onUserSelect() {
    this.resetBelow('user');

    if (!this.selectedRoleId) {
      alert('Please select a role first.');
      this.selectedUserId = null;
      return;
    }

    const user = this.users.find((u) => u.id === this.selectedUserId);
    if (!user) return;

    // If user has no permissions, create default permissions for all main modules
    if (!user.permissions || user.permissions.length === 0) {
      user.permissions = this.availableMainModules.map((m) => ({
        id: m.id,
        title: m.title,
        color: m.color,
        permissions: [this.createDefaultPermissionForModule(m.id, m.title)],
        subPermissions: (m.subPermissions || []).map((s) => ({
          id: s.id,
          label: s.label,
          option: s.option,
          route: s.route,
          permissions: [this.createDefaultPermissionForModule(s.id, s.option)],
          nestedPermissions: (s.nestedPermissions || []).map((n) => ({
            id: n.id,
            label: n.label,
            option: n.option,
            route: n.route,
            permissions: [
              this.createDefaultPermissionForModule(n.id, n.option),
            ],
          })),
        })),
      }));
    }

    this.availableMainModules = user.permissions;
  }

  onMainModuleSelect() {
    this.resetBelow('mainModule');
    if (!this.selectedUserId) {
      alert('Please select a user first.');
      this.selectedMainModule = null;
      return;
    }
    this.availableSubModules = this.selectedMainModule?.subPermissions || [];
    this.selectedMainModuleId = this.selectedMainModule?.id ?? null;
    this.initializePermissions();
  }

  onSubModuleSelect() {
    this.resetBelow('subModule');
    if (!this.selectedMainModule) {
      alert('Please select a main module first.');
      this.selectedSubModule = null;
      return;
    }
    this.availableNestedModules =
      this.selectedSubModule?.nestedPermissions || [];
    this.selectedSubModuleId = this.selectedSubModule?.id ?? null;
    this.initializePermissions();
  }

  onNestedModuleSelect() {
    if (!this.selectedNestedModule) return;
    this.initializePermissions();
  }

  // ------------------ PERMISSION CHANGE ------------------

  onPermissionChange(level: 'main' | 'sub' | 'nested') {
    if (!this.selectedUserId || !this.selectedRoleId || !this.selectedCompanyId)
      return;

    const payloads: any[] = [];

    // Main
    if (level === 'main' && this.selectedMainModule) {
      if (this.selectedMainModule.permissions.length === 0) {
        payloads.push({
          orgId: this.selectedCompanyId,
          userId: this.selectedUserId,
          roleId: this.selectedRoleId,
          SidenavbarId: this.selectedMainModule.id,
          canRead: false,
          canWrite: false,
          canPut: false,
          canDelete: false,
          isVisible: false,
          isHidden: false,
          isRestricted: false,
        });
      } else {
        this.selectedMainModule.permissions.forEach((perm) => {
          payloads.push({
            orgId: this.selectedCompanyId,
            userId: this.selectedUserId,
            roleId: this.selectedRoleId,
            SidenavbarId: perm.id,
            canRead: perm.canread,
            canWrite: perm.canwrite,
            canPut: perm.canput,
            canDelete: perm.candelete,
            isVisible: perm.isvisible,
            isHidden: perm.ishidden,
            isRestricted: perm.isrestricted,
          });
        });
      }
    }

    // Sub
    if (level === 'sub' && this.selectedSubModule) {
      if (this.selectedSubModule.permissions.length === 0) {
        payloads.push({
          orgId: this.selectedCompanyId,
          userId: this.selectedUserId,
          roleId: this.selectedRoleId,
          SubSidenavbarId: this.selectedSubModule.id,
          canRead: false,
          canWrite: false,
          canPut: false,
          canDelete: false,
          isVisible: false,
          isHidden: false,
          isRestricted: false,
        });
      } else {
        this.selectedSubModule.permissions.forEach((perm) => {
          payloads.push({
            orgId: this.selectedCompanyId,
            userId: this.selectedUserId,
            roleId: this.selectedRoleId,
            SubSidenavbarId: perm.id,
            canRead: perm.canread,
            canWrite: perm.canwrite,
            canPut: perm.canput,
            canDelete: perm.candelete,
            isVisible: perm.isvisible,
            isHidden: perm.ishidden,
            isRestricted: perm.isrestricted,
          });
        });
      }
    }

    // Nested
    if (level === 'nested' && this.selectedNestedModule) {
      if (this.selectedNestedModule.permissions.length === 0) {
        payloads.push({
          orgId: this.selectedCompanyId,
          userId: this.selectedUserId,
          roleId: this.selectedRoleId,
          NestSidenavbarId: this.selectedNestedModule.id,
          canRead: false,
          canWrite: false,
          canPut: false,
          canDelete: false,
          isVisible: false,
          isHidden: false,
          isRestricted: false,
        });
      } else {
        this.selectedNestedModule.permissions.forEach((perm) => {
          payloads.push({
            orgId: this.selectedCompanyId,
            userId: this.selectedUserId,
            roleId: this.selectedRoleId,
            NestSidenavbarId: perm.id,
            canRead: perm.canread,
            canWrite: perm.canwrite,
            canPut: perm.canput,
            canDelete: perm.candelete,
            isVisible: perm.isvisible,
            isHidden: perm.ishidden,
            isRestricted: perm.isrestricted,
          });
        });
      }
    }

    this.http
      .post(`${this.apiUrl}/rights/save-rights`, payloads, {
        withCredentials: true,
      })
      .subscribe({
        next: () => console.log(`Permissions saved: ${level}`, payloads),
        error: (err) => console.error('Failed to save permissions', err),
      });
  }

  // ------------------ RESET ------------------

  resetBelow(level: string) {
    switch (level) {
      case 'company':
        this.selectedRoleId = null;
        this.availableRoles = [];
        break;
      case 'role':
        this.selectedUserId = null;
        this.availableUsers = [];
        break;
      case 'user':
        this.selectedMainModule = null;
        this.availableMainModules = [];
        break;
      case 'mainModule':
        this.selectedSubModule = null;
        this.availableSubModules = [];
        break;
      case 'subModule':
        this.selectedNestedModule = null;
        this.availableNestedModules = [];
        break;
    }
  }
}
