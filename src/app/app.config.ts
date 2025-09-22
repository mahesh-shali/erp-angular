import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule, provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withXsrfConfiguration,
} from '@angular/common/http';
import { AuthService, SectionService } from './services/auth';
import { FormsModule } from '@angular/forms';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { XsrfInterceptor } from './interceptors/xsrf.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    MatSnackBarModule,
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    { provide: HTTP_INTERCEPTORS, useClass: XsrfInterceptor, multi: true },
    AuthService,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    SectionService, // Ensure SectionService is provided
    FormsModule,
    provideClientHydration(withEventReplay()),
    // provideClientHydration(withEventReplay()), // Import FormsModule for template-driven forms
  ],
};
