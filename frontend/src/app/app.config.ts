import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from '@core/interceptors/authentication-interceptor';
import { UserPreferences } from '@core/services/user-preferences';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      inject(UserPreferences);
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authenticationInterceptor])),
  ],
};
