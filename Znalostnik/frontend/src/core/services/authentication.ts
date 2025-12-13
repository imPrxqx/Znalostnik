import { Injectable } from '@angular/core';
import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { ROUTES } from '@core/contants/routes';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  user = signal<User | null>(null);
  http: HttpClient = inject(HttpClient);

  async login(email: string, password: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiURL}${ROUTES.LOGIN}`, { email, password }),
      );
      await this.loadUser();
    } catch (err: any) {
      this.user.set(null);
      throw new Error(err?.error?.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${environment.apiURL}${ROUTES.LOGOUT}`, null));
    } finally {
      this.user.set(null);
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiURL}${ROUTES.REGISTER}`, { email, password }),
      );
      await this.login(email, password);
    } catch (err: any) {
      this.user.set(null);
      throw new Error(err?.error?.message || 'Register failed');
    }
  }

  async refresh(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${environment.apiURL}/refresh`, {}));
      await this.loadUser();
    } catch {
      this.user.set(null);
    }
  }

  async loadUser(): Promise<void> {
    try {
      const account = await firstValueFrom(
        this.http.get<User>(`${environment.apiURL}${ROUTES.ACCOUNT}`),
      );
      this.user.set(account);
    } catch {
      this.user.set(null);
    }
  }
}
