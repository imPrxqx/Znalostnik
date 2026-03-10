import { RouterOutlet, RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Authentication } from '@core/services/authentication';

@Component({
  selector: 'app-account',
  imports: [
    RouterOutlet,
    RouterModule,
    MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    CommonModule,
  ],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  auth = inject(Authentication);
  logout() {
    this.auth.logout();
  }
}
