import { Component, inject } from '@angular/core';
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
  authService: Authentication = inject(Authentication);
  router: Router = inject(Router);
  email: string = '';
  password: string = '';
  errorMessage = signal<boolean>(false);
  errorTimeoutId: any;

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
