import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, EMPTY } from 'rxjs';
import { BlobOptions } from 'buffer';
import { environment } from '../../../environments/environment.development';
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
      .post(`${this.apiUrl}/login?useCookies=true`, data, { withCredentials: true })
      .pipe(tap(() => this.isLoggedIn.next(true)));
  }

  logout() {
    return this.http
      .post(`${this.apiUrl}/logout`, null, { withCredentials: true })
      .pipe(tap(() => this.isLoggedIn.next(false)));
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true }).pipe(
      tap(() =>
        this.login(data)
          .pipe(tap(() => this.isLoggedIn.next(true)))
          .subscribe(),
      ),
    );
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgotPassword`, { email });
  }

  loadUser() {
    return this.http
      .get<{ username: string }>(`${this.apiUrl}/account/me`, { withCredentials: true })
      .pipe(tap(() => this.isLoggedIn.next(true)));
  }
}
