import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Authentication } from '@core/services/authentication';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'frontend';

  auth: Authentication = inject(Authentication);

  ngOnInit(): void {
    this.auth.loadUser();
  }
}
