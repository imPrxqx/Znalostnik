import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuizTask, Task } from '@shared/models/format';
import { environment } from '@environments/environment';
import { SessionApi } from './session-api';
import { Router } from '@angular/router';

interface Session {
  id: string;
}

interface SessionUser {
  id: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionState {
  session = signal<Session | null>(null);
  sessionUser = signal<SessionUser | null>(null);
  task = signal<Task | undefined>(new QuizTask());
  api = inject(SessionApi);
  router = inject(Router);

  joinSession(accessCode: string) {
    this.api.joinSession(accessCode).subscribe({
      next: (id: any) => {
        this.loadSession(id);
        this.loadSessionUser(id);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  startSession() {
    // if (this.session() !== null) {
    //   this.http
    //     .post(`${environment.apiURL}/sessions/${this.session()!.id}/start`, null)
    //     .subscribe();
    // }
  }

  endSession() {
    // if (this.session() !== null) {
    //   this.http.post(`${environment.apiURL}/sessions/${this.session()!.id}/end`, null).subscribe();
    // }
  }

  loadSessionUser(sessionId: string) {
    this.api.loadSessionUser(sessionId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.session.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadSession(sessionId: string) {
    this.api.loadSession(sessionId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.session.set(data);
        //this.router.navigate(['/session/participant']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadTask(taskId: string) {}

  nextTask() {}

  submitAnswer(answer: string) {}
}
