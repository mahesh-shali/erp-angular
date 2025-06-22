import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
  private apiUrl = 'http://localhost:5133/api/auth/login';
  private _roleId = new BehaviorSubject<number | null>(null);
  roleId$ = this._roleId.asObservable();

  constructor(private http: HttpClient) {
    // Initialize roleId from localStorage on service creation
    const storedRoleId = localStorage.getItem('roleId');
    if (storedRoleId) {
      this._roleId.next(+storedRoleId);
    }
  }

  login(dto: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, dto).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem(
          'roleId',
          response.roleId !== null ? response.roleId.toString() : ''
        );
        this._roleId.next(response.roleId);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // or sessionStorage
  }

  getRoleId(): number | null {
    return this._roleId.value;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('subPermissions');
    localStorage.removeItem('subPermissions:timestamp');
    localStorage.removeItem('mainPermissions');
    localStorage.removeItem('mainPermissions:timestamp');
    this._roleId.next(null);
  }
}

export class SectionService {
  private sectionSource = new BehaviorSubject<string | null>(null);
  section$ = this.sectionSource.asObservable();

  setSection(section: string) {
    this.sectionSource.next(section);
  }
}
