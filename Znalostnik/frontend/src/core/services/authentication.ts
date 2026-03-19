import { Injectable } from '@angular/core';
import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';

export enum UserType {
  Registered,
  Guest,
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
}

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  user = signal<User | null>(null);
  http = inject(HttpClient);
  router = inject(Router);

  register(email: string, password: string) {
    this.http.post(`${environment.apiURL}/users/register`, { email, password }).subscribe({
      next: () => {
        this.router.navigate(['/authentication/login']);
      },
    });
  }

  login(email: string, password: string) {
    this.http
      .post(`${environment.apiURL}/users/login?useCookies=true`, { email, password })
      .subscribe({
        next: () => {
          this.loadUser();
          this.router.navigate(['']);
        },
        error: () => {
          this.user.set(null);
        },
      });
  }

  logout() {
    this.http.post(`${environment.apiURL}/users/logout`, null).subscribe({
      next: () => {
        this.user.set(null);
        this.router.navigate(['']);
      },
    });
  }

  loadUser() {
    this.http.get<User>(`${environment.apiURL}/users/me`).subscribe({
      next: (account) => {
        if (account.userType === UserType.Registered) {
          this.user.set(account);
        }
      },
      error: () => this.user.set(null),
    });
  }

  initGuest() {
    return this.http.post<User>(`${environment.apiURL}/users/guest`, null);
  }
}
