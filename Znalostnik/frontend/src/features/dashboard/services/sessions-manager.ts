import { inject, Injectable, signal } from '@angular/core';
import { SessionsApi } from './sessions-api';
import { Router } from '@angular/router';
import { GameSetting, Session } from '@shared/models/session';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SessionsManager {
  activeSessions = signal<Session[]>([]);
  finishedSessions = signal<Session[]>([]);
  api = inject(SessionsApi);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  createSession(
    exerciseId: string,
    title: string,
    respondType: string,
    gameMode: string,
    gameSetting: GameSetting,
  ) {
    this.api.createSession(exerciseId, title, respondType, gameMode, gameSetting).subscribe({
      next: () => {
        this.router.navigate([`/my-sessions`]);
        this.snackBar.open(
          $localize`:@@session.created:Relace byla vytvořena`,
          $localize`:@@close:Zavřít`,
          { duration: 3000 },
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadMyActiveSessions() {
    this.api.loadMyActiveSessions().subscribe({
      next: (json) => {
        this.activeSessions.set(json as Session[]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadMyFinishedSessions() {
    this.api.loadMyFinishedSessions().subscribe({
      next: (json) => {
        this.finishedSessions.set(json as Session[]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteSession(sessionId: string) {
    this.api.deleteSession(sessionId).subscribe({
      next: () => {
        this.snackBar.open(
          $localize`:@@session.deleted:Relace byla odstraněna`,
          $localize`:@@close:Zavřít`,
          { duration: 3000 },
        );
        this.loadMyActiveSessions();
        this.loadMyFinishedSessions();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
