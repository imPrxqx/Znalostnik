import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  authService: Authentication;
  email: string = '';
  password: string = '';

  constructor(authService: Authentication) {
    this.authService = authService
  }



  login() {

    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe();
  }
}
