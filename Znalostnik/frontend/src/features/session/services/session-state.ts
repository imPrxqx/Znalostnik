import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExerciseTaskFactory, QuizTask, Registry, Task, TaskAnswer } from '@shared/models/format';
import { environment } from '@environments/environment';
import { SessionApi } from './session-api';
import { Router } from '@angular/router';
import { catchError, forkJoin, switchMap, of } from 'rxjs';

export interface Session {
  id: string;
  accessCode: string;
  status: string;
}

export interface SessionUser {
  id: number;
  userName: string;
  team: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class SessionState {
  session = signal<Session | undefined>(undefined);
  sessionUser = signal<SessionUser | undefined>(undefined);
  sessionUsers = signal<SessionUser[]>([]);
  role = signal<string | undefined>(undefined);
  task = signal<Task | undefined>(undefined);
  answer = signal<TaskAnswer | undefined>(undefined);
  loading = signal<boolean>(false);

  api = inject(SessionApi);
  router = inject(Router);

  startSession(sessionId: string) {
    this.api.startSession(sessionId).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadSessionRole(sessionId: string) {
    this.api.loadSessionRole(sessionId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.role.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  joinSession(accessCode: string) {
    this.api.joinSession(accessCode).subscribe({
      next: (id: any) => {
        this.router.navigate([`/session/${id}/participant`]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadSessionUser(sessionId: string) {
    this.api.loadSessionUser(sessionId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.sessionUser.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadSessionUsers(sessionId: string) {
    this.api.loadSessionUsers(sessionId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.sessionUsers.set(data);
        console.log(this.sessionUsers());
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ensureLoaded(sessionId: string) {
    const current = this.session();

    if (current && current.id === sessionId) {
      return;
    }

    this.loadSession(sessionId);
  }

  loadSession(sessionId: string) {
    if (this.session() && this.session()!.id === sessionId) {
      return;
    }

    if (this.loading()) {
      return;
    }

    this.api
      .loadSession(sessionId)
      .pipe(
        switchMap((session: any) => {
          if (!session) {
            this.router.navigate([`/session/join`]);
          }

          console.log('session', session);
          this.session.set(session);
          const exerciseTask = ExerciseTaskFactory.createFromJson(session.currentExerciseTask);
          this.task.set(exerciseTask);

          return forkJoin({
            sessionUsers: this.api.loadSessionUsers(sessionId).pipe(
              catchError((err) => {
                return [];
              }),
            ),
            sessionUser: this.api.loadSessionUser(sessionId).pipe(
              catchError((err) => {
                return of(undefined);
              }),
            ),
            sessionRole: this.api.loadSessionRole(sessionId),
          });
        }),
      )
      .subscribe({
        next: (data) => {
          this.sessionUsers.set(data.sessionUsers as SessionUser[]);
          this.sessionUser.set(data.sessionUser as SessionUser);
          this.role.set(data.sessionRole as string);

          if (this.session()?.status === 'Lobby') {
            this.router.navigate([`/session/${sessionId}/lobby`]);
          } else if (this.session()?.status === 'Active') {
            if (this.role() === 'Participant') {
              this.router.navigate([`/session/${sessionId}/participant`]);
            }

            if (this.role() === 'Host') {
              this.router.navigate([`/session/${sessionId}/host`]);
            }
          } else if (this.session()?.status === 'Ended') {
            this.router.navigate([`/session/join`]);
          }

          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        },
      });
  }

  nextTask(sessionId: string) {
    this.api.nextTask(sessionId).subscribe({
      next: (data: any) => {
        this.session.set(data);
        const exerciseTask = ExerciseTaskFactory.createFromJson(data.currentExerciseTask);
        this.task.set(exerciseTask);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  previousTask(sessionId: string) {
    this.api.previousTask(sessionId).subscribe({
      next: (data: any) => {
        this.session.set(data);
        const exerciseTask = ExerciseTaskFactory.createFromJson(data.currentExerciseTask);
        this.task.set(exerciseTask);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadCurrentAnswer(sessionId: string) {
    this.api.loadCurrentAnswer(sessionId).subscribe({
      next: (data: any) => {
        const answer = Registry.createAnswer(this.task()?.type(), data);
        this.answer.set(answer);
      },
      error: (error) => {
        console.error(error);
        const answer = Registry.createAnswer(this.task()?.type(), undefined);
        console.log(this.task()!.id());
        answer.taskId = this.task()!.id();
        this.answer.set(answer);
        console.log(this.answer());
      },
    });
  }

  submitAnswer(sessionId: string, answer: any) {
    this.api.submitAnswer(sessionId, answer).subscribe({
      next: (data: any) => {
        console.log(data);
        this.answer.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
