import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Exercise, ExercisesManager } from '@features/dashboard/services/exercises-manager';
import { Slide } from '@features/exercise-editor/components/slide/slide';
import { ExerciseTaskFactory, Task } from '@shared/models/format';

@Component({
  selector: 'app-exercise-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, Slide, CommonModule],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.scss',
})
export class ExerciseCard {
  exercise = input.required<Exercise>();
  task = signal<Task | undefined>(undefined);
  exercises = inject(ExercisesManager);
  router = inject(Router);

  ngOnInit() {
    this.exercises.loadFirstTask(this.exercise().id).subscribe({
      next: (json) => {
        const task = ExerciseTaskFactory.createFromJson(json);
        this.task.set(task);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  openEditor() {
    this.router.navigate([`/exercise-editor/${this.exercise().id}`]);
  }

  deleteExercise() {
    this.exercises.deleteExercise(this.exercise().id);
  }

  createSession() {
    this.exercises.createSession(this.exercise().id);
  }
}
