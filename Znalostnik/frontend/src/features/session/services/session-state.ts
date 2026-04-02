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

export interface Team {
  id: number;
  teamName: string;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  id: number;
  userName: string;
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
  teams = signal<Team[]>([]);
  loading = signal<boolean>(false);

  api = inject(SessionApi);
  router = inject(Router);

  ensureLoaded(sessionId: string) {
    const current = this.session();

    if (current && current.id === sessionId) {
      this.ensureNavigate(sessionId);
      return;
    }

    this.loadSession(sessionId);
  }

  ensureNavigate(sessionId: string) {
    const current = this.session();

    if (current && current.id === sessionId) {
      if (current?.status === 'Lobby') {
        this.router.navigate([`/session/${sessionId}/lobby`], { replaceUrl: true });
      } else if (current?.status === 'Active') {
        if (this.role() === 'Participant') {
          this.router.navigate([`/session/${sessionId}/participant`], { replaceUrl: true });
        }

        if (this.role() === 'Host') {
          this.router.navigate([`/session/${sessionId}/host`], { replaceUrl: true });
        }
      } else if (current?.status === 'Ended') {
        this.router.navigate([`/session/join`], { replaceUrl: true });
      }
    }
  }

  loadSession(sessionId: string) {
    if (this.session() && this.session()!.id === sessionId) {
      return;
    }

    if (this.loading()) {
      return;
    }

    this.loading.set(true);
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
          console.log('task', this.task());
          return forkJoin({
            teams: this.api.loadSessionTeams(sessionId).pipe(
              catchError((err) => {
                return [];
              }),
            ),
            answer: this.api.loadCurrentAnswer(sessionId).pipe(
              catchError((err) => {
                return of(undefined);
              }),
            ),
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
          console.log(data);
          this.teams.set(data.teams as Team[]);
          this.sessionUsers.set(data.sessionUsers as SessionUser[]);
          this.sessionUser.set(data.sessionUser as SessionUser);
          this.role.set(data.sessionRole as string);

          if (this.session()?.status === 'Lobby') {
            this.router.navigate([`/session/${sessionId}/lobby`], { replaceUrl: true });
          } else if (this.session()?.status === 'Active') {
            if (this.role() === 'Participant') {
              this.loadCurrentAnswer(sessionId);
              this.router.navigate([`/session/${sessionId}/participant`], { replaceUrl: true });
            }

            if (this.role() === 'Host') {
              this.router.navigate([`/session/${sessionId}/host`], { replaceUrl: true });
            }
          } else if (this.session()?.status === 'Ended') {
            this.router.navigate([`/session/join`], { replaceUrl: true });
          }

          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        },
      });
  }

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
        console.log(data);
        const answer = Registry.createAnswer(this.task()?.type(), data);
        console.log('LOADED answer', answer);
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

  loadSessionTeams(sessionId: string) {
    this.api.loadSessionTeams(sessionId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.teams.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  submitAnswer(sessionId: string, answer: any) {
    console.log(answer);
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

  joinSessionTeam(sessionId: string, teamId: string) {
    this.api.joinSessionTeam(sessionId, teamId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.teams.update((teams) => [...teams, data]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createSessionTeam(sessionId: string, teamName: string) {
    this.api.createSessionTeam(sessionId, teamName).subscribe({
      next: (data: any) => {
        console.log(data);
        this.teams.update((teams) => [...teams, data]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  confirmAnswer(sessionId: string) {
    this.api.confirmCurrentAnswer(sessionId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.answer.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateSession() {
    this.api.loadSession(this.session()!.id).subscribe({
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

  updateSessionUser() {
    this.api.loadSessionUser(this.session()!.id).subscribe({
      next: (data: any) => {
        this.sessionUser.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateSessionUsers() {
    this.api.loadSessionUsers(this.session()!.id).subscribe({
      next: (data: any) => {
        this.sessionUsers.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateAnswer() {
    this.api.loadCurrentAnswer(this.session()!.id).subscribe({
      next: (data: any) => {
        const answer = Registry.createAnswer(this.task()?.type(), data);
        this.answer.set(answer);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
