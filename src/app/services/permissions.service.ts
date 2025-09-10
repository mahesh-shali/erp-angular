import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { SidebarItem } from '../constants/constants';

interface PermissionsResponse {
  mainPermissions: SidebarItem[];
  subPermissions?: any[];
}

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private apiUrl = environment.apiUrl;

  private mainPermissionsSource = new BehaviorSubject<SidebarItem[]>(
    this.readFromLocalStorage<SidebarItem[]>('mainPermissions') || []
  );
  mainPermissions$ = this.mainPermissionsSource.asObservable();

  private subPermissionsSource = new BehaviorSubject<any[]>(
    this.readFromLocalStorage<any[]>('subPermissions') || []
  );
  subPermissions$ = this.subPermissionsSource.asObservable();

  private pollSub?: Subscription;
  private startedForRoleId?: number;

  constructor(private http: HttpClient) {}

  startPolling(roleId: number, token: string) {
    if (!roleId || !token) return;
    if (this.startedForRoleId === roleId && this.pollSub) return; // already running
    this.startedForRoleId = roleId;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Immediately fetch once, then every 5s
    this.pollSub = timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.http.get<PermissionsResponse>(
            `${this.apiUrl}/auth/permissions/${roleId}`,
            { headers }
          )
        )
      )
      .subscribe({
        next: (resp) => {
          const main = (resp.mainPermissions || []).filter((p) => (p as any).isvisible !== false);
          const sub = (resp.subPermissions || []).filter((p) => (p as any).isvisible !== false);

          this.mainPermissionsSource.next(main);
          this.subPermissionsSource.next(sub);

          this.writeToLocalStorage('mainPermissions', main);
          this.writeToLocalStorage('subPermissions', sub);
        },
        error: () => {
          // Keep last good values; do not crash the poller
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


