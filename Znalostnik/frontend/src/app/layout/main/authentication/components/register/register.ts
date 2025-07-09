import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Authentication } from '../../services/authentication';
import { signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(authService: Authentication, router: Router) {
    this.authService = authService;
    this.router = router;
  }
  router: Router;
  authService: Authentication;
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
