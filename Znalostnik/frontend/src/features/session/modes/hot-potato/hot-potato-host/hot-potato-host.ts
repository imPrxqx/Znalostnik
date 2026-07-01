import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SessionState } from '@features/session/services/session-state';
import { Timer } from '@features/session/timer/timer';
import { Registry } from '@shared/models/registry';
import { ShowActivityDialog } from '../../../show-activity-dialog/show-activity-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Activity } from '@shared/models/activity';

@Component({
  selector: 'app-hot-potato-host',
  imports: [MatIconModule, MatButtonModule, Timer, CommonModule],
  templateUrl: './hot-potato-host.html',
  styleUrl: './hot-potato-host.scss',
})
export class HotPotatoHost {
  state = inject(SessionState);
  sessionId = computed(() => this.state.session()?.id);
  timer = computed(() => this.state.session()?.gameState.timerEnd);
  potatoes = computed(() => this.state.session()?.gameState.activePotatoes);
  sessionUsers = computed(() => this.state.sessionUsers());
  teams = computed(() => this.state.teams());
  status = computed(() => this.state.session()?.gameState.status);
  participants = computed(() => this.state.session()?.gameState.participants);
  aliveParticipants = computed(() => this.state.session()?.gameState.aliveParticipants);
  deadParticipants = computed(() => {
    const alive = this.aliveParticipants();
    const all = this.state.session()?.gameState.participants ?? [];
    return all.filter((user: string) => !alive.includes(user));
  });
  hasNextRound = computed(() => this.state.session()?.gameState.aliveParticipants.length > 1);
  dialog = inject(MatDialog);
  openedPotatoId: string | undefined = undefined;
  openedActivity = signal<Activity | undefined>(undefined);

  constructor() {
    effect(() => {
      const participant = this.state
        .session()
        ?.gameState.activePotatoes?.find(
          (p: { potatoId: string }) => p.potatoId === this.openedPotatoId,
        );

      if (this.openedPotatoId !== undefined) {
        const activity = Registry.createActivity(participant.activity.type, participant.activity);
        this.openedActivity.set(activity);
      }
    });
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

  nextRound() {
    if (this.sessionId()) {
      this.state.nextActivity(this.sessionId()!);
    }
  }

  endRound() {
    if (this.sessionId()) {
      this.state.endSessionRound(this.sessionId()!);
    }
  }

  endSession() {
    if (this.sessionId()) {
      this.state.endSession(this.sessionId()!);
    }
  }

  openParticipantDetail(potatoId: string): void {
    const json = this.potatoes().find(
      (p: { potatoId: string }) => p.potatoId === potatoId,
    ).activity;
    const activity = Registry.createActivity(json.type, json);

    this.openedPotatoId = potatoId;
    this.openedActivity.set(activity);

    const dialogRef = this.dialog.open(ShowActivityDialog, {
      width: '800px',
      height: '500px',
      data: this.openedActivity,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openedPotatoId = undefined;
        this.openedActivity.set(undefined);
      }
    });
  }
}
