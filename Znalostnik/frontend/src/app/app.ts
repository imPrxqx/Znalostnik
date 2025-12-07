import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '@shared/components/footer/footer';
import { Header } from '@shared/components/header/header';
import { Authentication } from '@core/services/authentication';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
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
