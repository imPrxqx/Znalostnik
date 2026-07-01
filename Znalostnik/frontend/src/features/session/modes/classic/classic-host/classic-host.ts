import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseActivity } from '@features/exercise-editor/components/exercise-activity/exercise-activity';
import { SessionState } from '@features/session/services/session-state';
import { Timer } from '@features/session/timer/timer';
@Component({
  selector: 'app-classic-host',
  imports: [MatIconModule, MatButtonModule, Timer, CommonModule, ExerciseActivity],
  templateUrl: './classic-host.html',
  styleUrl: './classic-host.scss',
})
export class ClassicHost {
  state = inject(SessionState);
  sessionId = computed(() => this.state.session()?.id);
  timer = computed(() => this.state.session()?.gameState.timerEnd);
  sessionUsers = computed(() => this.state.sessionUsers());
  teams = computed(() => this.state.teams());
  status = computed(() => this.state.session()?.gameState.status);
  leaderboard = computed(() => this.state.session()?.gameState.leaderboard);
  activity = computed(() => this.state.activity());
  activityIndex = computed(() => this.state.session()?.gameState.activityIndex + 1);
  totalActivities = computed(() => this.state.session()?.gameState.totalActivities);
  isLastActivity = computed(
    () =>
      this.state.session()?.gameState.activityIndex ===
      this.state.session()?.gameState.totalActivities - 1,
  );
  hasPreviousActivity = computed(() => this.state.session()?.gameState.activityIndex > 0);
  hasNextActivity = computed(
    () =>
      this.state.session()?.gameState.activityIndex <
      this.state.session()?.gameState.totalActivities - 1,
  );
  totalParticipants = computed(() => this.state.session()?.gameState.totalParticipants);
  totalAnsweredParticipants = computed(() => this.state.session()?.gameState.answeredParticipants);

  endSession() {
    if (this.sessionId()) {
      this.state.endSession(this.sessionId()!);
    }
  }

  previousActivity() {
    if (this.sessionId()) {
      this.state.previousActivity(this.sessionId()!);
    }
  }

  nextActivity() {
    if (this.sessionId()) {
      this.state.nextActivity(this.sessionId()!);
    }
  }

  endRound() {
    if (this.sessionId()) {
      this.state.endSessionRound(this.sessionId()!);
    }
  }

  getUserName(participantId: string) {
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
}
