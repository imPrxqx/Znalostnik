import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { ExerciseTask } from '@features/exercise-editor/components/exercise-task/exercise-task';
import { SessionState } from '../services/session-state';
import { Task } from '@shared/models/format';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Hub } from '../services/hub';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Timer } from '../timer/timer';
@Component({
  selector: 'app-participant',
  imports: [
    ExerciseTask,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatToolbarModule,
    Timer,
  ],
  templateUrl: './participant.html',
  styleUrl: './participant.scss',
})
export class Participant {
  state = inject(SessionState);
  route = inject(ActivatedRoute);
  router = inject(Router);
  session = computed(() => this.state.session());
  task = computed(() => this.state.task());
  answer = linkedSignal(() => this.state.answer());
  submission = computed(() => this.state.submission());
  hub = inject(Hub);
  end = signal<Date>(new Date(new Date().getTime() + 30000));

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate([`/session/join`]);
      return;
    }

    this.state.loadSession(sessionId);
    this.state.loadCurrentAnswer(sessionId);
  }

  submitAnswer() {
    console.log('answer submitted: ', this.answer());
    this.state.submitAnswer(this.session()?.id!, this.answer()!);
  }
}
