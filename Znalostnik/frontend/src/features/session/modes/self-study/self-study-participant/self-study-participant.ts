import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseActivity } from '@features/exercise-editor/components/exercise-activity/exercise-activity';
import { SessionState } from '@features/session/services/session-state';
import { Registry } from '@shared/models/registry';
import { Activity } from '@shared/models/activity';
import { ActivityAnswer } from '@shared/models/activity-answer';
import { ActivityFactory } from '@shared/models/activity-factory';

@Component({
  selector: 'app-self-study-participant',
  imports: [CommonModule, MatButtonModule, MatIconModule, ExerciseActivity],
  templateUrl: './self-study-participant.html',
  styleUrl: './self-study-participant.scss',
})
export class SelfStudyParticipant {
  state = inject(SessionState);
  sessionUser = computed(() => this.state.sessionUser());
  sessionId = computed(() => this.state.session()?.id);
  score = computed(() => this.state.session()?.gameState.score);
  activity = computed(() => this.state.activity());
  answer = linkedSignal(() => this.state.answer());
  status = signal<'answering' | 'feedback'>('answering');
  feedbackActivity = signal<Activity | undefined>(undefined);
  feedbackAnswer = signal<ActivityAnswer | undefined>(undefined);
  showedFeedback = signal(true);
  lastFeedbackId = signal<string | undefined>(undefined);

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
        const answer = Registry.createAnswer(feedback.activity.type, feedback.answer);
        this.feedbackAnswer.set(answer);
      }

      this.status.set('feedback');

      setTimeout(() => {
        this.status.set('answering');
      }, 3000);
    });
  }

  confirmAnswer() {
    this.feedbackAnswer.set(undefined);
    this.feedbackActivity.set(undefined);
    this.showedFeedback.set(false);
    this.state.confirmAnswer(this.sessionId()!, this.answer()!);
  }

  submitAnswer() {
    this.state.submitAnswer(this.sessionId()!, this.answer()!);
  }

  getCorrectPercent(participant: { completedCount: number; correctCount: number }): number {
    const completed = participant.completedCount;
    const correct = participant.correctCount;

    if (completed == 0) {
      return 100;
    }

    if (correct == 0) {
      return 0;
    }

    return (correct / completed) * 100;
  }
}
