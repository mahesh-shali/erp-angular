import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
