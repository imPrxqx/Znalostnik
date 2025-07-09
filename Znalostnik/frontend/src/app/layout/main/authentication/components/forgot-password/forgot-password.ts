import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Authentication } from '../../services/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  router: Router;
  authService: Authentication;
  email: string = '';

  constructor(authService: Authentication, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  forgot() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => this.router.navigate(['/reset-password']),
      error: (err) => {
        console.log('Email is not correct');
      },
    });
  }
}
