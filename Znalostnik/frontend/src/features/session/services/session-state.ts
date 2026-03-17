import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuizTask, Task } from '@shared/models/format';
import { environment } from '@environments/environment';

interface Session {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionState {
  session = signal<Session | null>(null);
  task = signal<Task | undefined>(new QuizTask());
  http = inject(HttpClient);

  createSession(exerciseId: string) {
    const dto = {
      exerciseID: exerciseId,
    };

    this.http.post(`${environment.apiURL}/sessions`, dto).subscribe();
  }

  joinSession(code: string) {
    const dto = {
      code: code,
    };

    this.http.post(`${environment.apiURL}/sessions/join`, dto).subscribe();
  }

  startSession() {
    if (this.session() !== null) {
      this.http
        .post(`${environment.apiURL}/sessions/${this.session()!.id}/start`, null)
        .subscribe();
    }
  }

  endSession() {
    if (this.session() !== null) {
      this.http.post(`${environment.apiURL}/sessions/${this.session()!.id}/end`, null).subscribe();
    }
  }

  loadSession(sessionId: string) {
    this.http.get<Session>(`${environment.apiURL}/sessions/${sessionId}`).subscribe({
      next: (data) => {
        this.session.set(data);
      },
      error: (err) => {
        console.error('Failed to load session', err);
      },
    });
  }

  loadTask(taskId: string) {}

  nextTask() {}

  submitAnswer(answer: string) {}
}
