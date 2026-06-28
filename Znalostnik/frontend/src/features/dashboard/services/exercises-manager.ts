import { Injectable, inject, signal } from '@angular/core';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { ExercisesApi } from './exercises-api';
import { Router } from '@angular/router';
import { ExerciseFactory } from '@shared/models/exercise-factory';
import { Activity } from '@shared/models/activity';
import { ActivityFactory } from '@shared/models/activity-factory';
import { Tag } from '@shared/models/tag';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Exercise } from '@shared/models/exercise';

@Injectable({
  providedIn: 'root',
})
export class ExercisesManager {
  exercises = signal<Exercise[]>([]);
  document = inject(ExerciseDocumentManager);
  api = inject(ExercisesApi);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  loadMyExercises() {
    this.api.loadMyExercises().subscribe({
      next: (json: any) => {
        const exercises = json.map((ex: any) => ExerciseFactory.createFromJson(ex));
        this.exercises.set([]);
        this.exercises.set(exercises);
      },
      error: (error) => {
        this.exercises.set([]);
      },
    });
  }

  createExercise(title: string = 'Untitled Exercise') {
    this.api.createExercise(title).subscribe({
      next: () => {
        this.loadMyExercises();
        this.snackBar.open(
          $localize`:@@exercise.created:Cvičení bylo vytvořeno`,
          $localize`:@@close:Zavřít`,
          { duration: 3000 },
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  editExercise(exerciseId: string) {
    this.api.loadExercise(exerciseId).subscribe({
      next: (json) => {
        const exercise = ExerciseFactory.createFromJson(json);
        exercise.id.set(exerciseId);
        this.document.loadDocument(exercise);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadFirstActivity(exerciseId: string) {
    return this.api.loadFirstActivity(exerciseId);
  }

  deleteExercise(exerciseId: string) {
    this.api.deleteExercise(exerciseId).subscribe({
      next: () => {
        this.loadMyExercises();
        this.snackBar.open(
          $localize`:@@exercise.deleted:Cvičení bylo odstraněno`,
          $localize`:@@close:Zavřít`,
          { duration: 3000 },
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  saveExercise(exerciseId: string, json: any) {
    this.api.saveExercise(exerciseId, json).subscribe({
      next: () => {
        this.snackBar.open(
          $localize`:@@exercise.saved:Cvičení bylo uloženo`,
          $localize`:@@close:Zavřít`,
          { duration: 3000 },
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
