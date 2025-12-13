import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Authentication } from '@core/services/authentication';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router: Router = inject(Router);
  auth: Authentication = inject(Authentication);

  email: string = '';
  password: string = '';

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  async login() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const data = {
      email: this.email,
      password: this.password,
    };

    try {
      await this.auth.login(this.email, this.password);
      await this.router.navigate(['/']);
    } catch (e: any) {
      this.errorMessage.set(e.message);
    } finally {
      this.isLoading.set(false);
    }
  }
}
