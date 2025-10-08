import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getItems(roleId: number): Observable<any[]> {
    if (roleId === 1) {
      return this.http.get<any[]>(`${this.apiUrl}/item/getItems`, {
        withCredentials: true,
      });
    } else if (roleId === 2) {
      return this.http.get<any[]>(`${this.apiUrl}/item/getItems`, {
        withCredentials: true,
      });
    }
    return this.http.get<any[]>(`${this.apiUrl}/item/getItems`, {
      withCredentials: true,
    }); // fallback
  }
}
