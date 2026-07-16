import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SessionsManager } from '@features/dashboard/services/sessions-manager';
import { Session } from '@shared/models/session';
import { RegistrySession } from '@shared/registry/registry-session';

/**
 * Displays session summary and provides actions
 * such as opening, viewing reports and deleting sessions.
 */
@Component({
  selector: 'app-session-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss',
})
export class SessionCard {
  session = input.required<Session>();
  manager = inject(SessionsManager);
  router = inject(Router);
  status = computed(() => {
    const session = this.session();
    const status = RegistrySession.getSessionStatus(session.status).name;
    return status;
  });
  gameMode = computed(() => {
    const session = this.session();
    const gameMode = RegistrySession.getGameMode(session.gameMode).name;
    return gameMode;
  });
  respondType = computed(() => {
    const session = this.session();
    const respondType = RegistrySession.getRespondType(session.respondType).name;
    return respondType;
  });

  openSession() {
    console.log(this.session());
    this.router.navigate([`/session/${this.session().id}/host`]);
  }

  openSessionReport() {
    this.router.navigate([`/my-statistics/${this.session().id}`]);
  }

  deleteSession() {
    this.manager.deleteSession(this.session().id);
  }
}
