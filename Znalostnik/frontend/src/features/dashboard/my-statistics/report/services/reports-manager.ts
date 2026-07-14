import { inject, Injectable, signal } from '@angular/core';
import { ReportsApi } from './reports-api';
import { Router } from '@angular/router';
import { ActivityAnswer } from '@shared/models/activity-answer';
import { RegistryActivity } from '@shared/registry/registry-activity';
import { Activity } from '@shared/models/activity';
import { Participant, SessionReport } from '@shared/models/session';
import { ActivityFactory } from '@shared/factories/activity-factory';

/**
 * Manages loading session report data.
 */
@Injectable({
  providedIn: 'root',
})
export class ReportsManager {
  api = inject(ReportsApi);
  router = inject(Router);
  id = signal<string>('');
  title = signal<string>('');
  respondType = signal<string>('individual');
  answers = signal<ActivityAnswer[]>([]);
  activities = signal<Activity[]>([]);
  participants = signal<Participant[]>([]);

  loadReport(sessionId: string) {
    this.api.loadReport(sessionId).subscribe({
      next: (json) => {
        console.log('Report data', json);
        const data = json as SessionReport;
        this.id.set(data.id);
        this.title.set(data.title);
        this.respondType.set(data.respondType);
        this.participants.set(data.participants);
        this.activities.set(data.activities.map((a) => ActivityFactory.createFromJson(a)));

        this.answers.set(
          data.answers.map((a) =>
            RegistryActivity.createAnswer(
              this.activities()
                .find((at) => at.id() === a.activityId)!
                .type(),
              a,
            ),
          ),
        );

        console.log('Loaded answers', this.answers());
        console.log('Loaded activities', this.activities());
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
