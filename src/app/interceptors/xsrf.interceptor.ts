// import { Injectable } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from '../services/auth'; // Adjust the path as necessary

// @Injectable()
// export class XsrfInterceptor implements HttpInterceptor {
//   // private getXsrfToken(): string | null {
//   //   // Parse cookies manually
//   //   const match = document.cookie.match(
//   //     new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)')
//   //   );
//   //   return match ? decodeURIComponent(match[2]) : null;
//   // }

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     let cloned = req;
//     if (this.authService.jwtToken) {
//       cloned = cloned.clone({
//         setHeaders: { Authorization: `Bearer ${this.authService.jwtToken}` },
//       });
//     }
//     if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method.toUpperCase())) {
//       if (this.authService.xsrfToken) {
//         cloned = cloned.clone({
//           setHeaders: { 'X-XSRF-TOKEN': this.authService.xsrfToken },
//         });
//       }
//     }
//     // Only attach token for state-changing methods
//     // if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method.toUpperCase())) {
//     //   const token = this.getXsrfToken();
//     //   if (token) {
//     //     const cloned = req.clone({
//     //       withCredentials: true,
//     //       setHeaders: { 'X-XSRF-TOKEN': token },
//     //     });
//     //     return next.handle(cloned);
//     //   }
//     // }

//     // Still include cookies for GET/etc
//     //const cloned = req.clone({ withCredentials: true });
//     return next.handle(cloned);
//   }
// }

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';
import { StorageService } from '../services/StorageService';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
  // ✅ Inject AuthService via constructor
  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let cloned = req.clone({ withCredentials: true });

    // Attach JWT if present
    if (this.authService.jwtToken) {
      cloned = cloned.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.jwtToken}`,
        },
      });
    }

    const xsrfToken = this.storageService.get('XSRF-TOKEN');

    // Attach XSRF token for state-changing methods
    if (
      xsrfToken &&
      ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method.toUpperCase()) &&
      this.authService.xsrfToken
    ) {
      cloned = cloned.clone({
        setHeaders: {
          'X-XSRF-TOKEN': this.authService.xsrfToken || xsrfToken,
        },
      });
    }

    return next.handle(cloned);
  }
}
