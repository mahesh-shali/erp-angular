import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from 'src/environments/environment.prod';
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
    return this.http.post<LoginResponse>(this.loginUrl, dto).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        if (response.roleId !== null) {
          localStorage.setItem('roleId', response.roleId.toString());
        }
        this._roleId.next(response.roleId);
        this.loginState.next(response.roleId);
      })
    );
  }

  setLoginState(token: string, roleId: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('roleId', roleId.toString());
    this.loginState.next(roleId);
    this._roleId.next(roleId);
  }

  isLoggedIn(): boolean {
    return !!this.storage.get('token');
  }

  getRoleId(): number | null {
    return this._roleId.value;
  }

  logout(): void {
    localStorage.removeItem('token');
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
