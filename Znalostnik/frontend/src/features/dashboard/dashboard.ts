import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Authentication } from '@core/services/authentication';
import { RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ExercisesManager } from './services/exercises-manager';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
  ],
})
export class Dashboard {
  auth = inject(Authentication);
  manager = inject(ExercisesManager);
  breakPoint = inject(BreakpointObserver);
  isMobile = signal(false);
  isOpened = signal(true);

  logout() {
    this.auth.logout();
  }

  constructor() {
    this.breakPoint.observe(['(max-width: 1200px)']).subscribe((r) => {
      this.isMobile.set(r.matches);
      this.isOpened.set(!r.matches);
    });
  }

  close() {
    if (this.isMobile()) {
      this.isOpened.set(false);
    }
  }

  toggle() {
    this.isOpened.set(!this.isOpened());
  }
}
