import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExerciseTaskFactory, QuizTask, Task } from '@shared/models/format';
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
  session = signal<Session | undefined>(undefined);
  sessionUser = signal<SessionUser | undefined>(undefined);
  role = signal<string | undefined>(undefined);
  task = signal<Task | undefined>(new QuizTask());
  sessionUsers = signal<SessionUser[]>([]);

  api = inject(SessionApi);
  router = inject(Router);

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
        this.router.navigate([`/sessions/${id}/participant`]);
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
        const exerciseTask = ExerciseTaskFactory.createFromJson(data.currentExerciseTask);
        this.task.set(exerciseTask);
      },
      error: (error) => {
        console.error(error);
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

  submitAnswer(answer: string) {}
}
