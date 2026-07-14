import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseActivity } from '@features/exercise-editor/components/exercise-activity/exercise-activity';
import { SessionState } from '@features/session/services/session-state';
import { Timer } from '@features/session/timer/timer';

/**
 * Displays participant component for game mode classic and provides submitting answers
 */
@Component({
  selector: 'app-classic-participant',
  imports: [CommonModule, MatButtonModule, MatIconModule, ExerciseActivity, Timer],
  templateUrl: './classic-participant.html',
  styleUrl: './classic-participant.scss',
})
export class ClassicParticipant {
  state = inject(SessionState);
  sessionUser = computed(() => this.state.sessionUser());
  sessionId = computed(() => this.state.session()?.id);
  timer = computed(() => this.state.session()?.gameState.timerEnd);
  status = computed(() => this.state.session()?.gameState.status);
  score = computed(() => this.state.session()?.gameState.score);
  activity = computed(() => this.state.activity());
  answer = linkedSignal(() => this.state.answer());

  confirmAnswer() {
    this.state.confirmAnswer(this.sessionId()!, this.answer()!);
  }

  submitAnswer() {
    this.state.submitAnswer(this.sessionId()!, this.answer()!);
  }
}
