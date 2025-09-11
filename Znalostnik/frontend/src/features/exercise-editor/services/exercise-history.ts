import { Injectable, inject } from '@angular/core';
import { ExerciseDocument } from './exercise-document';

@Injectable({
  providedIn: 'root',
})
export class ExerciseHistory {
  exerciseDocumentService: ExerciseDocument = inject(ExerciseDocument);

  history: any[] = [];
  currentIndex: number = -1;

  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;

      const snapshot = this.history[this.currentIndex];
      this.exerciseDocumentService.document.set(structuredClone(snapshot[1]));
      this.exerciseDocumentService.selectExercise(snapshot[0]);
    }
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;

      const snapshot = this.history[this.currentIndex];
      this.exerciseDocumentService.document.set(structuredClone(snapshot[1]));
      this.exerciseDocumentService.selectExercise(snapshot[0]);
    }
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.exerciseDocumentService.document.set({ exercises: [] });
    this.exerciseDocumentService.selectedExercise.set({ exercises: [] });
  }
}
