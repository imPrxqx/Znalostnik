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

/**
 * Handles user authentication
 */
@Injectable({
  providedIn: 'root',
})
export class Authentication {
  user = signal<User | null>(null);
  http = inject(HttpClient);
  router = inject(Router);

  /**
   * Registers a new user account and redirects to the login page.
   */
  register(email: string, password: string) {
    this.http
      .post(`${environment.apiURL}/users/register`, { email: email, password: password })
      .subscribe({
        next: () => {
          this.router.navigate(['/authentication/login']);
        },
      });
  }

  /**
   * Log in to user account and redirects to home page.
   */
  login(email: string, password: string) {
    this.http
      .post(`${environment.apiURL}/users/login?useCookies=true`, {
        email: email,
        password: password,
      })
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

  /**
   * Log out current user account.
   */
  logout() {
    this.http.post(`${environment.apiURL}/users/logout`, null).subscribe({
      next: () => {
        this.user.set(null);
      },
    });
  }

  /**
   * Loads user account details.
   */
  loadUser() {
    this.http.get<User>(`${environment.apiURL}/users/me`).subscribe({
      next: (account) => {
        if (account.userType === UserType.Registered) {
          this.user.set(account);
        }
      },
      error: () => {
        this.user.set(null);
      },
    });
  }

  /**
   * Initialize guest account for current user.
   */
  initGuest() {
    return this.http.post(`${environment.apiURL}/users/guest`, null);
  }

  /**
   * Creates forget password request for change password on email.
   */
  forgotPassword(email: string) {
    return this.http.post(`${environment.apiURL}/users/forgotPasswordV2`, { email: email });
  }

  /**
   * Resets current password on new password with reset code.
   */
  resetPassword(email: string, resetCode: string, newPassword: string) {
    return this.http.post(`${environment.apiURL}/users/resetPassword`, {
      email: email,
      resetCode: resetCode,
      newPassword: newPassword,
    });
  }

  /**
   * Updates current password on new password.
   */
  updatePassword(oldPassword: string, newPassword: string) {
    return this.http.post(`${environment.apiURL}/users/me/updatePassword`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  }

  /**
   * Deletes for current user account.
   */
  deleteAccount() {
    return this.http.delete(`${environment.apiURL}/users/me`).subscribe({
      next: () => {
        this.logout();
      },
    });
  }
}
