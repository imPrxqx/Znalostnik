import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        router.navigate(['/login']);
      }

      throw err;
    }),
  );
};
