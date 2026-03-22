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
  sessions = signal<Session[]>([]);
  api = inject(SessionsApi);
  router = inject(Router);

  loadMySessions() {
    this.api.loadMySessions().subscribe({
      next: (json: any) => {
        this.sessions.set(json);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
