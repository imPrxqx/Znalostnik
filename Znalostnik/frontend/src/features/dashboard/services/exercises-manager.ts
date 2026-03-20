import { Injectable, inject, signal } from '@angular/core';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { ExercisesApi } from './exercises-api';
import { ExerciseFactory, ExerciseTaskFactory, Task } from '@shared/models/format';
import { Router } from '@angular/router';

export interface Exercise {
  id: string;
  title: string;
  mode: string;
  settings: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class ExercisesManager {
  exercises = signal<Exercise[]>([]);
  document = inject(ExerciseDocumentManager);
  api = inject(ExercisesApi);
  router = inject(Router);

  loadMyExercises() {
    this.api.loadMyExercises().subscribe({
      next: (json: any) => {
        const exercises = json.map((ex: any) => ({
          ...ex,
          tasks: ex.tasks.map((task: Task) => ExerciseTaskFactory.createFromJson(task)),
        }));

        this.exercises.set(exercises);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createExercise(
    title: string = 'Untitled Exercise',
    mode: string = 'Interactive',
    settings: string = '{}',
  ) {
    this.api.createExercise(title, mode, settings).subscribe({
      next: () => {
        this.loadMyExercises();
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
        this.document.loadDocument(exercise);
        this.router.navigate(['/exercise-editor']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteExercise(exerciseId: string) {
    this.api.deleteExercise(exerciseId).subscribe({
      next: () => {
        this.loadMyExercises();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  saveExercise(exerciseId: string, json: any) {
    this.api.saveExercise(exerciseId, json).subscribe({
      next: () => {},
      error: (error) => {
        console.error(error);
      },
    });
  }
}
