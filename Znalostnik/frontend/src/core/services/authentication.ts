import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { ROUTES } from '@shared/contants/routes';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private apiUrl = environment.apiURL;
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();
  http: HttpClient = inject(HttpClient);

  login(data: any) {
    return this.http
      .post(`${this.apiUrl}${ROUTES.LOGIN}`, data)
      .pipe(tap(() => this.isLoggedIn.next(true)));
  }

  logout() {
    return this.http
      .post(`${this.apiUrl}${ROUTES.LOGOUT}`, null)
      .pipe(tap(() => this.isLoggedIn.next(false)));
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}${ROUTES.REGISTER}`, data).pipe(
      tap(() =>
        this.login(data)
          .pipe(tap(() => this.isLoggedIn.next(true)))
          .subscribe(),
      ),
    );
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}${ROUTES.FORGOT_PASSWORD}`, { email });
  }

  loadUser() {
    return this.http
      .get<{ username: string }>(`${this.apiUrl}${ROUTES.ACCOUNT}`)
      .pipe(tap(() => this.isLoggedIn.next(true)));
  }
}
