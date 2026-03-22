import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Exercise, ExercisesManager } from '@features/dashboard/services/exercises-manager';
import { Slide } from '@features/exercise-editor/components/slide/slide';
import { Task } from '@shared/models/format';

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

  openEditor() {
    this.exercises.editExercise(this.exercise().id);
  }

  deleteExercise() {
    this.exercises.deleteExercise(this.exercise().id);
  }

  createSession() {
    this.exercises.createSession(this.exercise().id);
  }
}
