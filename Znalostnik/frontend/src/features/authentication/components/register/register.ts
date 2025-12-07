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
  authService: Authentication = inject(Authentication);
  email: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  errorMessage = signal<boolean>(false);

  createAccount() {
    const data = {
      email: this.email,
      password: this.password,
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        console.log('Registration Success:', response);
        this.router.navigate(['/']);
        this.errorMessage.set(false);
      },
      error: (error) => {
        console.error('Registration not success:', error);
        this.errorMessage.set(true);
      },
    });
  }
}
