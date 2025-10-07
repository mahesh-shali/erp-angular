import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './StorageService';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  roleId: number;
  organizationId?: number | null;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  xsrfToken: string | null = null;
  jwtToken: string | null = null;
  private apiUrl = environment.apiUrl;
  private loginUrl = `${this.apiUrl}/auth/login`;
  private registerUrl = `${this.apiUrl}/auth/register`;

  private _userId = new BehaviorSubject<number | null>(this.getStoredUserId());
  private _roleId = new BehaviorSubject<number | null>(this.getStoredRoleId());
  private _organizationId = new BehaviorSubject<number | null>(
    this.getStoredOrganizationId()
  );
  userId$ = this._userId.asObservable();
  roleId$ = this._roleId.asObservable();
  OrganizationId$ = this._organizationId.asObservable();

  private loginState = new BehaviorSubject<number | null>(
    this.getStoredRoleId()
  );
  loginState$ = this.loginState.asObservable();

  constructor(private http: HttpClient, private storage: StorageService) {
    const storedRoleId = this.storage.get('roleId');
    const xsrfCookie = this.getCookie('XSRF-TOKEN');
    if (xsrfCookie) {
      this.storage.set('xsrfToken', xsrfCookie);
    }

    if (storedRoleId) {
      this._roleId.next(+storedRoleId);
    }
  }

  private getStoredRoleId(): number | null {
    const roleId = this.storage.get('roleId');
    return roleId ? parseInt(roleId, 10) : null;
  }
  private getStoredUserId(): number | null {
    const userId = this.storage.get('userId');
    return userId ? parseInt(userId, 10) : null;
  }
  private getStoredOrganizationId(): number | null {
    const organizationId = this.storage.get('organizationId');
    return organizationId ? parseInt(organizationId, 10) : null;
  }

  register(dto: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(this.registerUrl, dto);
  }

  login(dto: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.loginUrl, dto, { withCredentials: true })
      .pipe(
        tap((response: LoginResponse) => {
          if (response.roleId !== null) {
            localStorage.setItem('roleId', response.roleId.toString());
            this._roleId.next(response.roleId);
            this.loginState.next(response.roleId);
          }
          if (response.organizationId != null) {
            localStorage.setItem(
              'OrganizationId',
              response.organizationId.toString()
            );
            this._organizationId.next(response.organizationId);
          } else {
            localStorage.removeItem('OrganizationId');
            this._organizationId.next(null);
          }
          if (response.userId != null) {
            localStorage.setItem('userId', response.userId.toString());
            this._userId.next(response.userId);
          } else {
            localStorage.removeItem('userId');
            this._userId.next(null);
          }
        })
      );
  }

  setLoginState(
    token: string,
    roleId: number,
    userId: number,
    organizationId?: number | null,
    xsrfToken?: string,
    jwtToken?: string
  ) {
    // Token is managed via HttpOnly cookie; no local storage for token
    localStorage.setItem('roleId', roleId.toString());
    this.xsrfToken = xsrfToken || null;
    this.jwtToken = jwtToken || null;
    this.loginState.next(roleId);
    this._roleId.next(roleId);
    if (organizationId != null) {
      localStorage.setItem('organizationId', organizationId.toString());
      this._organizationId.next(organizationId);
    } else {
      localStorage.removeItem('organizationId');
      this._organizationId.next(null);
    }
    if (userId != null) {
      localStorage.setItem('userId', userId.toString());
      this._userId.next(userId);
    } else {
      localStorage.removeItem('userId');
      this._userId.next(null);
    }
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
  }
  isLoggedIn(): boolean {
    // With cookie auth, consider calling a /auth/me endpoint; fallback to roleId presence
    return !!this.storage.get('roleId');
  }

  getRoleId(): number | null {
    return this._roleId.value;
  }
  getOrganizationId(): number | null {
    return this._organizationId.value;
  }
  getUserId(): number | null {
    return this._userId.value;
  }

  logout(): void {
    // No token in localStorage when using cookies
    localStorage.removeItem('roleId');
    localStorage.removeItem('userId');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('lastRoute');
    localStorage.removeItem('subPermissions');
    localStorage.removeItem('subPermissions:timestamp');
    localStorage.removeItem('mainPermissions');
    localStorage.removeItem('mainPermissions:timestamp');
    localStorage.removeItem('fullPermissions');
    this._roleId.next(null);
    this._userId.next(null);
    this._organizationId.next(null);
    this.loginState.next(null);
  }
}

export class SectionService {
  private sectionSource = new BehaviorSubject<string | null>(null);
  section$ = this.sectionSource.asObservable();

  setSection(section: string) {
    this.sectionSource.next(section);
  }
}
