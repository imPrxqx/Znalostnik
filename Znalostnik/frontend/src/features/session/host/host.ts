import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExerciseTask } from '@features/exercise-editor/components/exercise-task/exercise-task';
import { QuizTask, Task } from '@shared/models/format';
import { SessionState } from '../services/session-state';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Timer } from '../timer/timer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Hub } from '../services/hub';

@Component({
  selector: 'app-host',
  imports: [
    ExerciseTask,
    MatListModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    Timer,
    MatProgressSpinnerModule,
  ],
  templateUrl: './host.html',
  styleUrl: './host.scss',
})
export class Host {
  hub = inject(Hub);
  state = inject(SessionState);
  route = inject(ActivatedRoute);
  router = inject(Router);
  session = computed(() => this.state.session());
  task = computed(() => this.state.task());
  sessionUsers = computed(() => this.state.sessionUsers());
  end = signal<Date>(new Date(new Date().getTime() + 30000));
  loading = computed(() => this.state.loading());

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate([`/session/join`]);
      return;
    }

    this.state.loadSession(sessionId);
  }

  previousTask() {
    if (this.session()) {
      this.state.previousTask(this.session()!.id);
    }
  }

  nextTask() {
    if (this.session()) {
      this.state.nextTask(this.session()!.id);
    }
  }
}
