import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../../../services/snackbar.service';

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
  isLoading = true;
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

  constructor(private http: HttpClient, private snackbar: SnackbarService) {}

  ngOnInit(): void {
    this.isLoading = true;
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

  // private initializePermissions() {
  //   if (
  //     this.selectedMainModule &&
  //     !this.selectedMainModule.permissions?.length
  //   ) {
  //     this.selectedMainModule.permissions = [
  //       this.createDefaultPermissionForModule(
  //         this.selectedMainModule.id,
  //         this.selectedMainModule.title
  //       ),
  //     ];
  //   }

  //   if (this.selectedSubModule && !this.selectedSubModule.permissions?.length) {
  //     this.selectedSubModule.permissions = [
  //       this.createDefaultPermissionForModule(
  //         this.selectedSubModule.id,
  //         this.selectedSubModule.option
  //       ),
  //     ];
  //   }

  //   if (
  //     this.selectedNestedModule &&
  //     !this.selectedNestedModule.permissions?.length
  //   ) {
  //     this.selectedNestedModule.permissions = [
  //       this.createDefaultPermissionForModule(
  //         this.selectedNestedModule.id,
  //         this.selectedNestedModule.option
  //       ),
  //     ];
  //   }
  // }
  // private initializePermissions() {
  //   if (this.selectedMainModule) {
  //     this.selectedMainModule.permissions ??= [];
  //     if (this.selectedMainModule.permissions.length === 0) {
  //       this.selectedMainModule.permissions.push(
  //         this.createDefaultPermissionForModule(
  //           this.selectedMainModule.id,
  //           this.selectedMainModule.title
  //         )
  //       );
  //     }
  //   }

  //   if (this.selectedSubModule) {
  //     this.selectedSubModule.permissions ??= [];
  //     if (this.selectedSubModule.permissions.length === 0) {
  //       this.selectedSubModule.permissions.push(
  //         this.createDefaultPermissionForModule(
  //           this.selectedSubModule.id,
  //           this.selectedSubModule.option
  //         )
  //       );
  //     }
  //   }

  //   if (this.selectedNestedModule) {
  //     this.selectedNestedModule.permissions ??= [];
  //     if (this.selectedNestedModule.permissions.length === 0) {
  //       this.selectedNestedModule.permissions.push(
  //         this.createDefaultPermissionForModule(
  //           this.selectedNestedModule.id,
  //           this.selectedNestedModule.option
  //         )
  //       );
  //     }
  //   }
  // }
  private normalizePermissions(module: any) {
    if (!module.permissions || module.permissions.length === 0) {
      module.permissions = [
        this.createDefaultPermissionForModule(
          module.id,
          module.label ?? module.option ?? module.title ?? 'Unnamed'
        ),
      ];
    }

    if (module.subPermissions) {
      module.subPermissions.forEach((sub: any) =>
        this.normalizePermissions(sub)
      );
    }

    if (module.nestedPermissions) {
      module.nestedPermissions.forEach((nested: any) =>
        this.normalizePermissions(nested)
      );
    }
  }

  private initializePermissions() {
    if (this.selectedMainModule) {
      this.normalizePermissions(this.selectedMainModule);
    }

    if (this.selectedSubModule) {
      this.normalizePermissions(this.selectedSubModule);
    }

    if (this.selectedNestedModule) {
      this.normalizePermissions(this.selectedNestedModule);
    }
  }

  // ------------------ FETCH PERMISSIONS ------------------

  // fetchAllPermissions() {
  //   this.http
  //     .get<any>(`${this.apiUrl}/rights/rights`, { withCredentials: true })
  //     .subscribe((res) => {
  //       // Companies
  //       this.companies = Object.keys(res.companies).map((k) => ({
  //         id: +k,
  //         name: res.companies[k],
  //       }));

  //       // Roles
  //       this.roles = res.roles;

  //       // Users
  //       this.users = res.users.map((u: any) => {
  //         const companyId =
  //           this.companies.find((c: Company) => c.name === u.company)?.id ?? 0;

  //         const permissions: PermissionGroup[] = (u.permissions || []).map(
  //           (m: any) => ({
  //             id: m.id,
  //             title: m.title,
  //             color: m.color,
  //             permissions: m.permissions?.map((p: any) => ({ ...p })) || [],
  //             subPermissions: (m.subPermissions || []).map((s: any) => ({
  //               id: s.id,
  //               label: s.label,
  //               option: s.option,
  //               route: s.route,
  //               permissions: s.permissions?.map((p: any) => ({ ...p })) || [],
  //               nestedPermissions: (s.nestedPermissions || []).map(
  //                 (n: any) => ({
  //                   id: n.id,
  //                   label: n.label,
  //                   option: n.option,
  //                   route: n.route,
  //                   permissions:
  //                     n.permissions?.map((p: any) => ({ ...p })) || [],
  //                 })
  //               ),
  //             })),
  //           })
  //         );

  //         return {
  //           ...u,
  //           companyId,
  //           permissions,
  //         };
  //         this.isLoading = false;
  //       });
  //     });
  // }
  fetchAllPermissions() {
    this.isLoading = true;

    this.http
      .get<any>(`${this.apiUrl}/rights/rights`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          try {
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
                this.companies.find((c: Company) => c.name === u.company)?.id ??
                0;

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
                    permissions:
                      s.permissions?.map((p: any) => ({ ...p })) || [],
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
              permissions.forEach((pg) => this.normalizePermissions(pg));

              return {
                ...u,
                companyId,
                permissions,
              };
            });
            this.isLoading = false;
          } catch (err) {
            console.error('Error processing permissions:', err);
          } finally {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error fetching permissions:', err);
          this.isLoading = false;
        },
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
    // Find the actual sub module in the selected user's permissions from API
    const user = this.users.find((u) => u.id === this.selectedUserId);
    if (!user) return;

    const mainModule = user.permissions?.find(
      (m) => m.id === this.selectedMainModule?.id
    );
    if (!mainModule) return;

    const subModule = mainModule.subPermissions?.find(
      (s) => s.id === this.selectedSubModule?.id
    );
    if (!subModule) {
      this.availableNestedModules = [];
      this.selectedNestedModule = null;
      alert('Cannot open nested modules: Sub module not found in API.');
      return;
    }

    // Only proceed if sub module has permissions from API
    if (!subModule.permissions?.length) {
      this.availableNestedModules = [];
      this.selectedNestedModule = null;
      alert(
        'Cannot open nested modules: No permissions in this sub module from API.'
      );
      return;
    }

    // Sub module has permissions, show nested modules
    this.availableNestedModules = subModule.nestedPermissions || [];
    this.selectedSubModuleId = subModule.id;

    this.availableNestedModules =
      this.selectedSubModule?.nestedPermissions || [];
    this.selectedSubModuleId = this.selectedSubModule?.id ?? null;
    //this.initializePermissions();
  }

  onNestedModuleSelect() {
    if (!this.selectedNestedModule) return;
    const user = this.users.find((u) => u.id === this.selectedUserId);
    if (!user) return;

    const mainModule = user.permissions?.find(
      (m) => m.id === this.selectedMainModule?.id
    );
    if (!mainModule) return;

    const subModule = mainModule.subPermissions?.find(
      (s) => s.id === this.selectedSubModule?.id
    );
    if (!subModule) return;

    // Only proceed if nestedPermissions exist in the API response
    if (!subModule.nestedPermissions?.length) {
      alert('Cannot open nested permissions: No permissions from API.');
      this.selectedNestedModule = null;
      this.availableNestedModules = [];
      return;
    }

    // Proceed normally
    this.availableNestedModules = subModule.nestedPermissions;
    this.initializePermissions();
    this.initializePermissions();
  }

  // ------------------ PERMISSION CHANGE ------------------

  // onPermissionChange(level: 'main' | 'sub' | 'nested') {
  //   if (!this.selectedUserId || !this.selectedRoleId || !this.selectedCompanyId)
  //     return;

  //   const payloads: any[] = [];

  //   // Main
  //   if (level === 'main' && this.selectedMainModule) {
  //     if (this.selectedMainModule.permissions.length === 0) {
  //       payloads.push({
  //         orgId: this.selectedCompanyId,
  //         userId: this.selectedUserId,
  //         roleId: this.selectedRoleId,
  //         SidenavbarId: this.selectedMainModule.id,
  //         canRead: false,
  //         canWrite: false,
  //         canPut: false,
  //         canDelete: false,
  //         isVisible: false,
  //         isHidden: false,
  //         isRestricted: false,
  //       });
  //     } else {
  //       this.selectedMainModule.permissions.forEach((perm) => {
  //         payloads.push({
  //           orgId: this.selectedCompanyId,
  //           userId: this.selectedUserId,
  //           roleId: this.selectedRoleId,
  //           SidenavbarId: perm.id,
  //           canRead: perm.canread,
  //           canWrite: perm.canwrite,
  //           canPut: perm.canput,
  //           canDelete: perm.candelete,
  //           isVisible: perm.isvisible,
  //           isHidden: perm.ishidden,
  //           isRestricted: perm.isrestricted,
  //         });
  //       });
  //     }
  //   }

  //   // Sub
  //   if (level === 'sub' && this.selectedSubModule) {
  //     if (this.selectedSubModule.permissions.length === 0) {
  //       payloads.push({
  //         orgId: this.selectedCompanyId,
  //         userId: this.selectedUserId,
  //         roleId: this.selectedRoleId,
  //         SubSidenavbarId: this.selectedSubModule.id,
  //         canRead: false,
  //         canWrite: false,
  //         canPut: false,
  //         canDelete: false,
  //         isVisible: false,
  //         isHidden: false,
  //         isRestricted: false,
  //       });
  //     } else {
  //       this.selectedSubModule.permissions.forEach((perm) => {
  //         payloads.push({
  //           orgId: this.selectedCompanyId,
  //           userId: this.selectedUserId,
  //           roleId: this.selectedRoleId,
  //           SubSidenavbarId: perm.id,
  //           canRead: perm.canread,
  //           canWrite: perm.canwrite,
  //           canPut: perm.canput,
  //           canDelete: perm.candelete,
  //           isVisible: perm.isvisible,
  //           isHidden: perm.ishidden,
  //           isRestricted: perm.isrestricted,
  //         });
  //       });
  //     }
  //   }

  //   // Nested
  //   if (level === 'nested' && this.selectedNestedModule) {
  //     if (this.selectedNestedModule.permissions.length === 0) {
  //       payloads.push({
  //         orgId: this.selectedCompanyId,
  //         userId: this.selectedUserId,
  //         roleId: this.selectedRoleId,
  //         NestSidenavbarId: this.selectedNestedModule.id,
  //         canRead: false,
  //         canWrite: false,
  //         canPut: false,
  //         canDelete: false,
  //         isVisible: false,
  //         isHidden: false,
  //         isRestricted: false,
  //       });
  //     } else {
  //       this.selectedNestedModule.permissions.forEach((perm) => {
  //         payloads.push({
  //           orgId: this.selectedCompanyId,
  //           userId: this.selectedUserId,
  //           roleId: this.selectedRoleId,
  //           NestSidenavbarId: perm.id,
  //           canRead: perm.canread,
  //           canWrite: perm.canwrite,
  //           canPut: perm.canput,
  //           canDelete: perm.candelete,
  //           isVisible: perm.isvisible,
  //           isHidden: perm.ishidden,
  //           isRestricted: perm.isrestricted,
  //         });
  //       });
  //     }
  //   }

  //   this.http
  //     .post(`${this.apiUrl}/rights/save-rights`, payloads, {
  //       withCredentials: true,
  //     })
  //     .subscribe({
  //       next: () => console.log(`Permissions saved: ${level}`, payloads),
  //       error: (err) => console.error('Failed to save permissions', err),
  //     });
  // }

  // onPermissionChange(level: 'main' | 'sub' | 'nested') {
  //   if (!this.selectedUserId || !this.selectedRoleId || !this.selectedCompanyId)
  //     return;

  //   try {
  //     const payloads: any[] = [];

  //     // Main
  //     if (level === 'main' && this.selectedMainModule) {
  //       if (this.selectedMainModule.permissions.length === 0) {
  //         payloads.push({
  //           orgId: this.selectedCompanyId,
  //           userId: this.selectedUserId,
  //           roleId: this.selectedRoleId,
  //           SidenavbarId: this.selectedMainModule.id,
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
  //             SidenavbarId: perm.id,
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

  //     // Sub
  //     if (level === 'sub' && this.selectedSubModule) {
  //       if (this.selectedSubModule.permissions.length === 0) {
  //         payloads.push({
  //           orgId: this.selectedCompanyId,
  //           userId: this.selectedUserId,
  //           roleId: this.selectedRoleId,
  //           SubSidenavbarId: this.selectedSubModule.id,
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
  //             SubSidenavbarId: perm.id,
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

  //     // Nested
  //     if (level === 'nested' && this.selectedNestedModule) {
  //       if (this.selectedNestedModule.permissions.length === 0) {
  //         payloads.push({
  //           orgId: this.selectedCompanyId,
  //           userId: this.selectedUserId,
  //           roleId: this.selectedRoleId,
  //           NestSidenavbarId: this.selectedNestedModule.id,
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
  //             NestSidenavbarId: perm.id,
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

  //     // API call
  //     this.http
  //       .post(`${this.apiUrl}/rights/save-rights`, payloads, {
  //         withCredentials: true,
  //       })
  //       .subscribe({
  //         next: () => {
  //           console.log(`Permissions saved: ${level}`, payloads);
  //           this.snackbar.showSuccess('Permissions updated successfully!');
  //         },
  //         error: (err) => {
  //           console.error('Failed to save permissions', err);
  //           this.snackbar.showError('Failed to update permissions. Try again.');
  //         },
  //       });
  //   } catch (err) {
  //     console.error('Unexpected error while preparing permissions', err);
  //     this.snackbar.showError(
  //       'Something went wrong while updating permissions.'
  //     );
  //   }
  // }
  onPermissionChange(level: 'main' | 'sub' | 'nested') {
    if (!this.selectedUserId || !this.selectedRoleId || !this.selectedCompanyId)
      return;

    try {
      const payloads: any[] = [];

      // ------------------ MAIN ------------------
      if (level === 'main' && this.selectedMainModule) {
        if (
          !this.selectedMainModule.permissions ||
          this.selectedMainModule.permissions.length === 0
        ) {
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

      // ------------------ SUB ------------------
      if (level === 'sub' && this.selectedSubModule) {
        // Only proceed if MainPermissions exist
        if (!this.selectedMainModule?.permissions?.length) {
          console.warn(
            'Sub-permissions skipped: MainPermissions do not exist.'
          );
        } else {
          if (!this.selectedSubModule.permissions?.length) {
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
      }

      // ------------------ NESTED ------------------
      if (level === 'nested' && this.selectedNestedModule) {
        // Only proceed if SubPermissions exist
        if (!this.selectedSubModule?.permissions?.length) {
          console.warn(
            'Nested-permissions skipped: SubPermissions do not exist.'
          );
        } else {
          if (!this.selectedNestedModule.permissions?.length) {
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
      }

      // ------------------ API CALL ------------------
      if (payloads.length) {
        this.http
          .post(`${this.apiUrl}/rights/save-rights`, payloads, {
            withCredentials: true,
          })
          .subscribe({
            next: () => {
              this.snackbar.showSuccess('Permissions updated successfully!');
            },
            error: (err) => {
              console.error('Failed to save permissions', err);
              this.snackbar.showError(
                'Failed to update permissions. Try again.'
              );
            },
          });
      }
    } catch (err) {
      console.error('Unexpected error while preparing permissions', err);
      this.snackbar.showError(
        'Something went wrong while updating permissions.'
      );
    }
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
