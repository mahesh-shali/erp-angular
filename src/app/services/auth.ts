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
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loginUrl = `${this.apiUrl}/auth/login`;
  private registerUrl = `${this.apiUrl}/auth/register`;

  private _roleId = new BehaviorSubject<number | null>(this.getStoredRoleId());
  roleId$ = this._roleId.asObservable();

  private loginState = new BehaviorSubject<number | null>(
    this.getStoredRoleId()
  );
  loginState$ = this.loginState.asObservable();

  constructor(private http: HttpClient, private storage: StorageService) {
    // Initialize roleId from localStorage on service creation
    const storedRoleId = this.storage.get('roleId');
    if (storedRoleId) {
      this._roleId.next(+storedRoleId);
    }
  }

  private getStoredRoleId(): number | null {
    const roleId = this.storage.get('roleId');
    return roleId ? parseInt(roleId, 10) : null;
  }

  register(dto: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(this.registerUrl, dto);
  }

  login(dto: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, dto, { withCredentials: true }).pipe(
      tap((response: LoginResponse) => {
        // Token is now stored in HttpOnly cookie by the server
        if (response.roleId !== null) {
          localStorage.setItem('roleId', response.roleId.toString());
        }
        this._roleId.next(response.roleId);
        this.loginState.next(response.roleId);
      })
    );
  }

  setLoginState(token: string, roleId: number) {
    // Token is managed via HttpOnly cookie; no local storage for token
    localStorage.setItem('roleId', roleId.toString());
    this.loginState.next(roleId);
    this._roleId.next(roleId);
  }

  isLoggedIn(): boolean {
    // With cookie auth, consider calling a /auth/me endpoint; fallback to roleId presence
    return !!this.storage.get('roleId');
  }

  getRoleId(): number | null {
    return this._roleId.value;
  }

  logout(): void {
    // No token in localStorage when using cookies
    localStorage.removeItem('roleId');
    localStorage.removeItem('lastRoute');
    localStorage.removeItem('subPermissions');
    localStorage.removeItem('subPermissions:timestamp');
    localStorage.removeItem('mainPermissions');
    localStorage.removeItem('mainPermissions:timestamp');
    this._roleId.next(null);
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
