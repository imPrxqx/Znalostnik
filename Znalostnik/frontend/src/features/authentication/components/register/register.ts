import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Authentication } from '@core/services/authentication';
import { signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  router: Router = inject(Router);
  auth: Authentication = inject(Authentication);

  email: string = '';
  password: string = '';
  passwordConfirmation: string = '';

  isLoading = signal(false);
  error = signal<string | null>(null);

  async createAccount() {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await this.auth.register(this.email, this.password);
      await this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(e.message || 'Login failed');
    } finally {
      this.isLoading.set(false);
    }
  }
}
