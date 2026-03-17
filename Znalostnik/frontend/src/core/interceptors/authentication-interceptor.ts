import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { Authentication } from '@core/services/authentication';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Authentication);
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        auth.initGuest().subscribe({
          next: () => {
            auth.loadUser();
            const retryReq = req.clone({ withCredentials: true });
            return next(retryReq);
          },
        });
      }

      throw err;
    }),
  );
};
