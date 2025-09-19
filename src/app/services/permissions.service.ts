// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Subscription, timer } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
// import { SidebarItem } from '../constants/constants';

// interface PermissionsResponse {
//   mainPermissions: SidebarItem[];
//   id: number;
//   orguserid: number;
//   sidenavbarid: number;
//   canread: boolean;
//   canwrite: boolean;
//   canput: boolean;
//   candelete: boolean;
//   isvisible: boolean;
//   ishidden: boolean;
//   isrestricted: boolean;
//   icon?: string;
//   label: string;
//   section: string;
//   subPermissions?: SubPermission[];
//   nestedSubPermissions?: any[];
// }

// export interface SubPermission {
//   id: number;
//   orguserid: number;
//   subsidenavbarid: number;
//   label: string;
//   option: string;
//   route: string;
//   isvisible: boolean;
//   nestedPermissions: any[];
//   isOpen?: boolean;
// }

// export interface MainPermission {
//   id: number;
//   orguserid: number;
//   sidenavbarid: number;
//   canread: boolean;
//   canwrite: boolean;
//   canput: boolean;
//   candelete: boolean;
//   isvisible: boolean;
//   ishidden: boolean;
//   isrestricted: boolean;
//   icon?: string;
//   label: string;
//   section: string;
//   subPermissions: SubPermission[];
// }

// @Injectable({ providedIn: 'root' })
// export class PermissionsService {
//   private apiUrl = environment.apiUrl;

//   private mainPermissionsSource = new BehaviorSubject<SidebarItem[]>(
//     this.readFromLocalStorage<SidebarItem[]>('mainPermissions') || []
//   );
//   mainPermissions$ = this.mainPermissionsSource.asObservable();

//   private subPermissionsSource = new BehaviorSubject<any[]>(
//     this.readFromLocalStorage<any[]>('subPermissions') || []
//   );
//   subPermissions$ = this.subPermissionsSource.asObservable();

//   private nestedSubPermissionsSource = new BehaviorSubject<any[]>(
//     this.readFromLocalStorage<any[]>('nestedSubPermissions') || []
//   );
//   nestedSubPermissions$ = this.nestedSubPermissionsSource.asObservable();

//   private pollSub?: Subscription;
//   private startedForRoleId?: number;

//   constructor(private http: HttpClient) {}

//   startPolling(roleId: number, token: string) {
//     if (!roleId) return;
//     if (this.startedForRoleId === roleId && this.pollSub) return; // already running
//     this.startedForRoleId = roleId;

//     // With cookie auth, no Authorization header is needed
//     const headers = new HttpHeaders({});

//     // Immediately fetch once, then every 5s
//     this.pollSub = timer(0, 5000)
//       .pipe(
//         switchMap(() =>
//           this.http.get<PermissionsResponse[]>(
//             `${this.apiUrl}/auth/permissions`,
//             { headers, withCredentials: true }
//           )
//         )
//       )
//       .subscribe({
//         next: (resp) => {
//           const prevSubs: (SubPermission & { isOpen?: boolean })[] =
//             this.readFromLocalStorage<SubPermission[]>('subPermissions') || [];

//           const main: SidebarItem[] = resp
//             .filter((p) => p.isvisible)
//             .map((p) => ({
//               id: p.id,
//               orguserid: p.orguserid,
//               sidenavbarid: p.sidenavbarid,
//               canread: p.canread,
//               canwrite: p.canwrite,
//               canput: p.canput,
//               candelete: p.candelete,
//               isvisible: p.isvisible,
//               ishidden: p.ishidden,
//               isrestricted: p.isrestricted,
//               icon: p.icon ?? '',
//               label: p.label,
//               section: p.section,
//               route: '',
//             }));

//           // const sub = resp
//           //   .flatMap((p) =>
//           //     (p.subPermissions || []).map((sp) => ({
//           //       ...sp,
//           //       nestedPermissions: sp.nestedPermissions || [], // normalize nested
//           //       isOpen: false, // for accordion
//           //     }))
//           //   )
//           //   .filter((sp) => sp.isvisible);
//           const sub: SubPermission[] = resp.flatMap((p) =>
//             (p.subPermissions || []).map((sp) => {
//               const prev = prevSubs.find((ps) => ps.id === sp.id);
//               return {
//                 ...sp,
//                 isOpen: prev?.isOpen ?? false, // preserve open state
//                 nestedPermissions: (sp.nestedPermissions || []).map((np) => {
//                   const prevNested = prev?.nestedPermissions?.find(
//                     (n) => n.id === np.id
//                   );
//                   return {
//                     ...np,
//                     isOpen: prevNested?.isOpen ?? false, // preserve nested open state
//                   };
//                 }),
//               };
//             })
//           );

//           this.mainPermissionsSource.next(main);
//           this.subPermissionsSource.next(sub);

//           this.writeToLocalStorage('mainPermissions', main);
//           this.writeToLocalStorage('subPermissions', sub);
//         },
//         error: (err) => {
//           // Keep last good values; do not crash
//           console.error('Error fetching permissions', err);
//         },
//       });
//   }

//   stopPolling() {
//     this.pollSub?.unsubscribe();
//     this.pollSub = undefined;
//     this.startedForRoleId = undefined;
//   }

//   private readFromLocalStorage<T>(key: string): T | null {
//     try {
//       const raw = localStorage.getItem(key);
//       return raw ? (JSON.parse(raw) as T) : null;
//     } catch {
//       return null;
//     }
//   }

//   private writeToLocalStorage(key: string, value: unknown) {
//     try {
//       localStorage.setItem(key, JSON.stringify(value));
//     } catch {}
//   }
// }
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SidebarItem } from '../constants/constants';
import { StorageService } from './StorageService';

export interface SubPermission {
  id: number;
  orguserid: number;
  subsidenavbarid: number;
  label: string;
  option: string;
  route: string;
  isvisible: boolean;
  nestedPermissions: NestedPermission[];
  isOpen?: boolean; // Accordion state
}

export interface ServiceSubPermission {
  id: number;
  orguserid: number;
  subsidenavbarid: number;
  label: string;
  option: string;
  route: string;
  isvisible: boolean;
  icon?: string;
  nestedPermissions?: ServiceSubPermission[];
  isOpen?: boolean;
}

export interface NestedPermission {
  id: number;
  option: string;
  route: string;
  isOpen?: boolean; // Accordion state for nested
  nestedPermissions?: NestedPermission[]; // Further nesting
}

export interface MainPermission {
  id: number;
  orguserid: number;
  sidenavbarid: number;
  canread: boolean;
  canwrite: boolean;
  canput: boolean;
  candelete: boolean;
  isvisible: boolean;
  ishidden: boolean;
  isrestricted: boolean;
  icon?: string;
  label: string;
  section: string;
  subPermissions: SubPermission[];
}

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private apiUrl = environment.apiUrl;

  private mainPermissionsSource = new BehaviorSubject<SidebarItem[]>(
    this.readFromLocalStorage<SidebarItem[]>('mainPermissions') || []
  );
  mainPermissions$ = this.mainPermissionsSource.asObservable();

  private subPermissionsSource = new BehaviorSubject<SubPermission[]>(
    this.readFromLocalStorage<SubPermission[]>('subPermissions') || []
  );
  subPermissions$ = this.subPermissionsSource.asObservable();

  private fullPermissionsSource = new BehaviorSubject<MainPermission[]>(
    this.readFromLocalStorage<MainPermission[]>('fullPermissions') || []
  );
  fullPermissions$ = this.fullPermissionsSource.asObservable();

  private pollSub?: Subscription;
  private startedForRoleId?: number;
  private xsrfToken: string | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  startPolling(roleId: number) {
    if (!roleId) return;
    if (this.startedForRoleId === roleId && this.pollSub) return;
    this.startedForRoleId = roleId;
    const token = localStorage.getItem('token');
    // const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const xsrf = this.storageService.get('xsrfToken');
    const headers = xsrf
      ? new HttpHeaders({ 'X-XSRF-TOKEN': xsrf })
      : undefined;

    this.pollSub = timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.http.get<MainPermission[]>(`${this.apiUrl}/auth/permissions`, {
            // headers,
            withCredentials: true,
          })
        )
      )
      .subscribe({
        next: (resp) => {
          // Read previous accordion states
          const prevSubs: SubPermission[] =
            this.readFromLocalStorage<SubPermission[]>('subPermissions') || [];

          // Build main permissions
          const main: SidebarItem[] = resp
            .filter((p) => p.isvisible)
            .map((p) => ({
              id: p.id,
              orguserid: p.orguserid,
              sidenavbarid: p.sidenavbarid,
              canread: p.canread,
              canwrite: p.canwrite,
              canput: p.canput,
              candelete: p.candelete,
              isvisible: p.isvisible,
              ishidden: p.ishidden,
              isrestricted: p.isrestricted,
              icon: p.icon ?? '',
              label: p.label,
              section: p.section,
              route: '',
            }));

          // Build subPermissions while preserving accordion states
          const sub: SubPermission[] = resp.flatMap((p) =>
            (p.subPermissions || []).map((sp) => {
              const prev = prevSubs.find((ps) => ps.id === sp.id);

              // Preserve nested states too
              const nested = (sp.nestedPermissions || []).map((np) => {
                const prevNested = prev?.nestedPermissions?.find(
                  (n) => n.id === np.id
                );
                return {
                  ...np,
                  isOpen: prevNested?.isOpen ?? false,
                };
              });

              return {
                ...sp,
                nestedPermissions: nested,
                isOpen: prev?.isOpen ?? false,
              };
            })
          );

          // Update BehaviorSubjects
          this.fullPermissionsSource.next(resp);
          this.mainPermissionsSource.next(main);
          this.subPermissionsSource.next(sub);

          // Save to localStorage
          this.writeToLocalStorage('fullPermissions', resp);
          this.writeToLocalStorage('mainPermissions', main);
          this.writeToLocalStorage('subPermissions', sub);
        },
        error: (err) => {
          console.error('Error fetching permissions', err);
        },
      });
  }

  stopPolling() {
    this.pollSub?.unsubscribe();
    this.pollSub = undefined;
    this.startedForRoleId = undefined;
  }

  private readFromLocalStorage<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  private writeToLocalStorage(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
}
