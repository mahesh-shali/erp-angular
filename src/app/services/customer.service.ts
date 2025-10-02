import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = environment.apiUrl;
  private superAdminApi = '/api/customer/customers';
  private adminApi = '/api/a/customers';

  constructor(private http: HttpClient) {}

  getCustomers(roleId: number): Observable<any[]> {
    if (roleId === 1) {
      return this.http.get<any[]>(`${this.apiUrl}/customer/customers`, {
        withCredentials: true,
      });
    } else if (roleId === 2) {
      return this.http.get<any[]>(`${this.apiUrl}/customer/customers`, {
        withCredentials: true,
      });
    }
    return this.http.get<any[]>(`${this.apiUrl}/customer/customers`, {
      withCredentials: true,
    }); // fallback
  }
}
