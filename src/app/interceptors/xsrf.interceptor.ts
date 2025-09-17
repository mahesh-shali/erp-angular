import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
  private getXsrfToken(): string | null {
    // Parse cookies manually
    const match = document.cookie.match(
      new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)')
    );
    return match ? decodeURIComponent(match[2]) : null;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only attach token for state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method.toUpperCase())) {
      const token = this.getXsrfToken();
      if (token) {
        const cloned = req.clone({
          withCredentials: true,
          setHeaders: { 'X-XSRF-TOKEN': token },
        });
        return next.handle(cloned);
      }
    }

    // Still include cookies for GET/etc
    const cloned = req.clone({ withCredentials: true });
    return next.handle(cloned);
  }
}
