import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { SectionService } from './services/auth';
import { FormsModule } from '@angular/forms';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(  
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN', // must match backend cookie name
        headerName: 'X-XSRF-TOKEN', // must match backend header name
      })
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    SectionService, // Ensure SectionService is provided
    FormsModule,
    provideClientHydration(withEventReplay()),
    provideClientHydration(withEventReplay()), // Import FormsModule for template-driven forms
  ],
};
