import { inject, Injectable, signal } from '@angular/core';
import { SessionApi } from './session-api';
import { Router } from '@angular/router';
import { catchError, forkJoin, switchMap, of } from 'rxjs';
import { RegistryActivity } from '@shared/registry/registry-activity';
import { Activity } from '@shared/models/activity';
import { ActivityAnswer } from '@shared/models/activity-answer';
import { ActivityFactory } from '@shared/factories/activity-factory';
import { Session, SessionUser, Team } from '@shared/models/session';

@Injectable({
  providedIn: 'root',
})
export class SessionState {
  session = signal<Session | undefined>(undefined);
  sessionUser = signal<SessionUser | undefined>(undefined);
  sessionUsers = signal<SessionUser[]>([]);
  teams = signal<Team[]>([]);
  role = signal<string | undefined>(undefined);
  activity = signal<Activity | undefined>(undefined);
  answer = signal<ActivityAnswer | undefined>(undefined);
  loading = signal<boolean>(false);
  api = inject(SessionApi);
  router = inject(Router);

  ensureNavigate() {
    const current = this.session();

    if (current) {
      if (current?.status === 'lobby') {
        this.router.navigate([`/session/${current.id}/lobby`], { replaceUrl: true });
      } else if (current?.status === 'active') {
        if (this.role() === 'participant') {
          this.router.navigate([`/session/${current.id}/participant`], { replaceUrl: true });
        }

        if (this.role() === 'host') {
          this.router.navigate([`/session/${current.id}/host`], { replaceUrl: true });
        }
      } else if (current?.status === 'finished') {
        this.router.navigate([`/home`], { replaceUrl: true });
      }
    }
  }

  loadSession(sessionId: string) {
    if (!this.session()) {
      this.loading.set(true);
    }

    this.api
      .loadSession(sessionId)
      .pipe(
        switchMap((session) => {
          if (!session) {
            this.router.navigate([`/home`]);
          }

          this.session.set(session as Session);

          console.log('session loaded: ', session);
          if (this.session()?.gameState.activity) {
            const exerciseActivity = ActivityFactory.createFromJson(
              this.session()?.gameState.activity,
            );
            this.activity.set(exerciseActivity);
          }

          if (this.session()?.gameState.answer) {
            const sessionAnswer = this.session()?.gameState.answer;

            if (
              !this.answer() ||
              this.answer()?.id !== sessionAnswer?.id ||
              this.answer()?.version !== sessionAnswer?.version
            ) {
              const answer = RegistryActivity.createAnswer(
                this.session()?.gameState.activity.type,
                sessionAnswer,
              );

              this.answer.set(answer);
            }
          }

          return forkJoin({
            teams: this.api.loadSessionTeams(sessionId).pipe(
              catchError(() => {
                return [];
              }),
            ),
            sessionUsers: this.api.loadSessionUsers(sessionId).pipe(
              catchError(() => {
                return [];
              }),
            ),
            sessionUser: this.api.loadSessionUser(sessionId).pipe(
              catchError(() => {
                return of(undefined);
              }),
            ),
            sessionRole: this.api.loadSessionRole(sessionId),
          });
        }),
      )
      .subscribe({
        next: (data) => {
          this.teams.set(data.teams as Team[]);
          this.sessionUsers.set(data.sessionUsers as SessionUser[]);
          this.sessionUser.set(data.sessionUser as SessionUser);
          this.role.set(data.sessionRole as string);
          this.ensureNavigate();
          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
          this.router.navigate([`/home`]);
        },
      });
  }

  startSession(sessionId: string) {
    this.api.startSession(sessionId).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }

  endSessionRound(sessionId: string) {
    this.api.endSessionRound(sessionId).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }

  endSession(sessionId: string) {
    this.api.endSession(sessionId).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }

  joinSession(accessCode: string, username: string) {
    this.api.joinSession(accessCode, username).subscribe({
      next: (id) => {
        this.router.navigate([`/session/${id}/lobby`]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  nextActivity(sessionId: string) {
    this.api.nextActivity(sessionId).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }

  previousActivity(sessionId: string) {
    this.api.previousActivity(sessionId).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadSessionTeams(sessionId: string) {
    this.api.loadSessionTeams(sessionId).subscribe({
      next: (data) => {
        this.teams.set(data as Team[]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  submitAnswer(sessionId: string, answer: ActivityAnswer) {
    this.api.submitAnswer(sessionId, answer).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }

  confirmAnswer(sessionId: string, answer: ActivityAnswer) {
    this.api.confirmCurrentAnswer(sessionId, answer).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }

  joinSessionTeam(sessionId: string, teamId: string) {
    this.api.joinSessionTeam(sessionId, teamId).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }

  createSessionTeam(sessionId: string, name: string) {
    this.api.createSessionTeam(sessionId, name).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }
}
