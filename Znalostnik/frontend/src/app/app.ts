import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Authentication } from './layout/main/authentication/authentication';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit  {
  protected title = 'frontend';
  isLoggedIn = false;
  
  constructor(private authService: Authentication) {}

  ngOnInit() {
    this.authService.loadUser();
    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
  }
}
