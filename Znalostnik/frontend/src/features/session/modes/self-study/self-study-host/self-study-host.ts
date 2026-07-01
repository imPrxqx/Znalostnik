import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SessionState } from '@features/session/services/session-state';
import { ShowActivityDialog } from '../../../show-activity-dialog/show-activity-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Registry } from '@shared/models/registry';
import { Activity } from '@shared/models/activity';

@Component({
  selector: 'app-self-study-host',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './self-study-host.html',
  styleUrl: './self-study-host.scss',
})
export class SelfStudyHost {
  state = inject(SessionState);
  sessionId = computed(() => this.state.session()?.id);
  sessionUsers = computed(() => this.state.sessionUsers());
  teams = computed(() => this.state.teams());
  status = computed(() => this.state.session()?.gameState.status);
  leaderboard = computed(() => this.state.session()?.gameState.leaderboard);
  dialog = inject(MatDialog);
  openedParticipantId: string | undefined = undefined;
  openedActivity = signal<Activity | undefined>(undefined);

  constructor() {
    effect(() => {
      const participant = this.state
        .session()
        ?.gameState.leaderboard?.find(
          (p: { participantId: string }) => p.participantId === this.openedParticipantId,
        );

      if (this.openedParticipantId !== undefined) {
        const activity = Registry.createActivity(participant.activity.type, participant.activity);
        this.openedActivity.set(activity);
      }
    });
  }

  leaderboardSorted = computed(() => {
    return [...this.leaderboard()].sort((a, b) => this.score(b) - this.score(a));
  });

  score(p: { completedCount: number; correctCount: number }) {
    const completed = p.completedCount ?? 0;
    const correct = p.correctCount ?? 0;

    if (completed === 0) {
      return 0;
    }

    const accuracy = correct / completed;

    const qualityWeight = Math.pow(accuracy, 1.5);
    const activityWeight = Math.log1p(completed);

    return qualityWeight * activityWeight;
  }

  endSession() {
    if (this.sessionId()) {
      this.state.endSession(this.sessionId()!);
    }
  }

  getParticipantName(participantId: string) {
    const sessionUser = this.sessionUsers()?.find((u) => u.id === participantId);

    if (sessionUser) {
      return sessionUser.userName;
    }

    const team = this.teams()?.find((t) => t.id === participantId);

    if (team) {
      return team.name;
    }

    return '';
  }

  openParticipantDetail(participantId: string): void {
    const json = this.leaderboard().find(
      (p: { participantId: string }) => p.participantId === participantId,
    ).activity;
    const activity = Registry.createActivity(json.type, json);
    this.openedParticipantId = participantId;
    this.openedActivity.set(activity);

    const dialogRef = this.dialog.open(ShowActivityDialog, {
      width: '800px',
      height: '500px',
      data: this.openedActivity,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openedParticipantId = undefined;
        this.openedActivity.set(undefined);
      }
    });
  }
}
