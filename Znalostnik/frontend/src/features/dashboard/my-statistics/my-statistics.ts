import { Component, computed, inject, signal, AfterViewInit } from '@angular/core';
import { SessionsManager } from '../services/sessions-manager';
import { SessionCard } from '../my-sessions/session-card/session-card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Report } from '@features/dashboard/my-statistics/report/report';
import { MatButtonModule } from '@angular/material/button';

/**
 * Displays all finished session owned by user and action for opening report of finished session
 */
@Component({
  selector: 'app-my-statistics',
  imports: [
    SessionCard,
    MatToolbarModule,
    SessionCard,
    MatIconModule,
    MatButtonModule,
    Report,
    RouterLink,
  ],
  templateUrl: './my-statistics.html',
  styleUrl: './my-statistics.scss',
})
export class MyStatistics implements AfterViewInit {
  manager = inject(SessionsManager);
  route = inject(ActivatedRoute);
  router = inject(Router);
  finishedSessions = computed(() => this.manager.finishedSessions());
  sessionId = signal<string | null>(null);

  constructor() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      return;
    }

    this.sessionId.set(sessionId);
  }

  ngAfterViewInit() {
    this.manager.loadMyFinishedSessions();
  }

  selectSession(id: string) {
    this.router.navigate(['/my-statistics', id]);
  }
}
