import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Authentication } from '../authentication';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(authService: Authentication) {
    this.authService = authService
  }

  authService: Authentication;
  email: string = '';
  password: string = '';

  login() {

    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data);
  }
}
