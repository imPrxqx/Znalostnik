import { Component, computed, inject, AfterViewInit } from '@angular/core';
import { SessionCard } from './session-card/session-card';
import { SessionsManager } from '../services/sessions-manager';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

/**
 * Displays users active sessions
 */
@Component({
  selector: 'app-my-sessions',
  imports: [SessionCard, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './my-sessions.html',
  styleUrl: './my-sessions.scss',
})
export class MySessions implements AfterViewInit {
  manager = inject(SessionsManager);
  activeSessions = computed(() => this.manager.activeSessions());

  ngAfterViewInit() {
    this.manager.loadMyActiveSessions();
  }
}
