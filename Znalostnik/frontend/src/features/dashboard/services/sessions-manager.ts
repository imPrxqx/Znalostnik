import { inject, Injectable, signal } from '@angular/core';
import { SessionsApi } from './sessions-api';
import { Router } from '@angular/router';

export interface Session {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionsManager {
  activeSessions = signal<Session[]>([]);
  finishedSessions = signal<Session[]>([]);
  api = inject(SessionsApi);
  router = inject(Router);

  createSession(
    exerciseId: string,
    title: string,
    respondType: string,
    gameMode: string,
    gameSetting: any,
  ) {
    this.api.createSession(exerciseId, title, respondType, gameMode, gameSetting).subscribe({
      next: (json) => {
        console.log(json);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadMyActiveSessions() {
    this.api.loadMyActiveSessions().subscribe({
      next: (json: any) => {
        this.activeSessions.set(json);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadMyFinishedSessions() {
    this.api.loadMyFinishedSessions().subscribe({
      next: (json: any) => {
        this.finishedSessions.set(json);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteSession(sessionId: string) {
    this.api.deleteSession(sessionId).subscribe({
      next: () => {
        this.loadMyActiveSessions();
        this.loadMyFinishedSessions();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
