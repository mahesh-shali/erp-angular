import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5133/api/auth/login';

  constructor(private http: HttpClient) {}

  login(dto: LoginPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // or sessionStorage
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    // add other user data if needed
  }
}

export class SectionService {
  private sectionSource = new BehaviorSubject<string | null>(null);
  section$ = this.sectionSource.asObservable();

  setSection(section: string) {
    this.sectionSource.next(section);
  }
}
