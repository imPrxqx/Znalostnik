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

/**
 * Provides a dashboard component with multiple sections
 * home, guide, my exercises, my sessions, my settings, my statistics
 */
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
    // Checks if screen is mobile when changing screen size
    this.breakPoint.observe(['(max-width: 1200px)']).subscribe((r) => {
      this.isMobile.set(r.matches);
      this.isOpened.set(!r.matches);
    });
  }

  /**
   * Closes sidenav menu when clicking on section in mobile version
   */
  close() {
    if (this.isMobile()) {
      this.isOpened.set(false);
    }
  }

  /**
   * Toggles opened sidenav menu inside mobile version
   */
  toggle() {
    this.isOpened.set(!this.isOpened());
  }
}
