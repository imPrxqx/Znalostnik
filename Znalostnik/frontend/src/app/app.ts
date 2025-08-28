import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../features/header/components/header';
import { Footer } from '../features/footer/components/footer';
import { Authentication } from '../features/authentication/services/authentication';
import { error } from 'console';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'frontend';

  authService: Authentication = inject(Authentication);

  ngOnInit(): void {
    this.authService.loadUser().subscribe({
      error: () => console.log('Loading user not success'),
      next: () => console.log('Loading user success'),
    });
  }
}
