import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Authentication } from '@core/services/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  router: Router = inject(Router);
  authService: Authentication = inject(Authentication);
  email: string = '';

  forgot() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => this.router.navigate(['/reset-password']),
      error: (err) => {
        console.log('Email is not correct');
      },
    });
  }
}
