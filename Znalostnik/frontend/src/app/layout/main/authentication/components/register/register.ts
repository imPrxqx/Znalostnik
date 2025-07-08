import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  
  constructor(authService: Authentication) {
    this.authService = authService
  }

  authService: Authentication;
  email: string = '';
  password: string = '';
  passwordConfirmation: string = '';

  createAccount() {

    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        console.log('Registration Success:', response);
      },
      error: (error) => {
        console.error('Registration not success:', error);
      }
    });
  }
}
