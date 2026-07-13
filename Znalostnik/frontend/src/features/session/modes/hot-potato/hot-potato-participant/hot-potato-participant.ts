import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseActivity } from '@features/exercise-editor/components/exercise-activity/exercise-activity';
import { SessionState } from '@features/session/services/session-state';
import { Timer } from '@features/session/timer/timer';
import { RegistryActivity } from '@shared/registry/registry-activity';
import { Activity } from '@shared/models/activity';
import { ActivityAnswer } from '@shared/models/activity-answer';
import { ActivityFactory } from '@shared/factories/activity-factory';

@Component({
  selector: 'app-hot-potato-participant',
  imports: [CommonModule, MatButtonModule, MatIconModule, ExerciseActivity, Timer],
  templateUrl: './hot-potato-participant.html',
  styleUrl: './hot-potato-participant.scss',
})
export class HotPotatoParticipant {
  state = inject(SessionState);
  sessionId = computed(() => this.state.session()?.id);
  sessionUser = computed(() => this.state.sessionUser());
  timer = computed(() => this.state.session()?.gameState.timerEnd);
  status = computed(() => this.state.session()?.gameState.status);
  participants = computed(() => this.state.session()?.gameState.participants);
  aliveParticipants = computed(() => this.state.session()?.gameState.aliveParticipants);
  activity = computed(() => this.state.activity());
  answer = linkedSignal(() => this.state.answer());
  feedbackActivity = signal<Activity | undefined>(undefined);
  feedbackAnswer = signal<ActivityAnswer | undefined>(undefined);
  showedFeedback = signal(true);
  lastFeedbackId = signal<string | undefined>(undefined);
  statusFeedback = signal<'answering' | 'feedback'>('answering');

  constructor() {
    effect(() => {
      const feedback = this.state.session()?.gameState?.feedback;

      if (!feedback) {
        this.feedbackActivity.set(undefined);
        this.feedbackAnswer.set(undefined);
        this.lastFeedbackId.set('undefined');
        return;
      }

      const fingerprint = feedback.activity.id + '|' + (feedback.answer?.id ?? 'null');

      if (!this.lastFeedbackId()) {
        this.lastFeedbackId.set(fingerprint);
        return;
      }

      if (this.lastFeedbackId() === fingerprint) {
        return;
      }

      this.lastFeedbackId.set(fingerprint);

      const activity = ActivityFactory.createFromJson(feedback.activity);
      this.feedbackActivity.set(activity);

      if (feedback.answer) {
        const answer = RegistryActivity.createAnswer(feedback.activity.type, feedback.answer);
        this.feedbackAnswer.set(answer);
      }

      this.statusFeedback.set('feedback');

      setTimeout(() => {
        this.statusFeedback.set('answering');
      }, 3000);
    });
  }

  confirmAnswer() {
    console.log('answer confirmed: ', this.answer());
    this.feedbackAnswer.set(undefined);
    this.feedbackActivity.set(undefined);
    this.showedFeedback.set(false);
    this.state.confirmAnswer(this.sessionId()!, this.answer()!);
  }

  submitAnswer() {
    console.log('answer submitted: ', this.answer());
    this.state.submitAnswer(this.sessionId()!, this.answer()!);
  }
}
