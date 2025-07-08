import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/components/header';
import { Footer } from './layout/footer/components/footer';
import { Authentication } from './layout/main/authentication/services/authentication';
import { error } from 'console';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'frontend';

  authService: Authentication;

  constructor(authService: Authentication) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.authService.loadUser().subscribe({
      error: () => console.log('Loading user not success')
    }  
    );
  }
}
