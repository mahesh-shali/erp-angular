import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth';

export interface User {
  email: string;
  id: number;
  roleId: number;
  name: string;
  organizationid: number;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalcode: number | null;
  country: string;
}

export interface UsersResponse {
  currentUserId: number;
  roleId: number;
  count: number;
  users: any[];
}

export interface Organization {
  email: string;
  id: number;
  userid: number;
  roleId: number;
  name: string;
}

export interface OrganizationResponse {
  currentUserId: number;
  roleId: number;
  count: number;
  users: any[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(): Observable<UsersResponse> {
    const userId = this.authService.getRoleId();
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.get<UsersResponse>(`${this.apiUrl}/user/getUser`, {
      withCredentials: true,
    });
    //   .pipe(
    //     map((response: UsersResponse) =>
    //       response.users.map((u) => ({
    //         id: u.id,
    //         roleId: u.roleId,
    //         name: u.name,
    //       }))
    //     ),
    //     catchError((err) => {
    //       console.error('Error fetching users', err);
    //       return throwError(() => err);
    //     })
    //   );
  }

  //   getUserById(id: number): Observable<UsersResponse> {
  //     return this.http.get<UsersResponse>(`${this.apiUrl}/user/getUser`);
  //   }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/role/roles`, {
      withCredentials: true,
    });
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/getUserById/${userId}`, {
      withCredentials: true,
    });
  }

  getOrganization(): Observable<OrganizationResponse> {
    const userId = this.authService.getRoleId();
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.get<OrganizationResponse>(
      `${this.apiUrl}/org/getOrganization`,
      {
        withCredentials: true,
      }
    );
  }

  getOrganizationById(orgId: number): Observable<Organization> {
    return this.http.get<Organization>(
      `${this.apiUrl}/org/getOrganizationById/${orgId}`,
      {
        withCredentials: true,
      }
    );
  }

  saveUser(user: Partial<User>): Observable<User> {
    if (user.id) {
      // Update
      return this.http.put<User>(
        `${this.apiUrl}/user/updateUser/${user.id}`,
        user,
        {
          withCredentials: true,
        }
      );
    } else {
      // Create
      return this.http.post<User>(`${this.apiUrl}/user/createUser`, user, {
        withCredentials: true,
      });
    }
  }

  saveOrganization(org: Partial<Organization>): Observable<Organization> {
    if (org.id) {
      return this.http.put<Organization>(
        `${this.apiUrl}/organizations/${org.id}`,
        org
      );
    } else {
      return this.http.post<Organization>(
        `${this.apiUrl}/user/createUser`,
        org
      );
    }
  }
}
