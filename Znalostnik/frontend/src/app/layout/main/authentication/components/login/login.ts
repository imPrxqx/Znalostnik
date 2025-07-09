import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Authentication } from '../../services/authentication';
import { RouterLink, Router, Route } from '@angular/router';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService: Authentication;
  router: Router;
  email: string = '';
  password: string = '';
  errorMessage = signal<boolean>(false);
  errorTimeoutId: any;

  constructor(authService: Authentication, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  login() {
    const data = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(data).subscribe({
      next: () => {
        this.errorMessage.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage.set(true);

        if (this.errorTimeoutId) {
          clearTimeout(this.errorTimeoutId);
        }

        this.errorTimeoutId = setTimeout(() => {
          this.errorMessage.set(false);
          this.errorTimeoutId = null;
        }, 3000);
      },
    });
  }
}
