import { Injectable } from '@angular/core';
import { ExerciseSnapshot } from '../interfaces/exercise-snapshot.interface';
import { ExerciseDocument } from '@shared/interfaces/exercise-document.interface';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocumentHistoryManager {
  private currentIndex: number = -1;
  private history: ExerciseSnapshot[] = [];

  undo(): ExerciseSnapshot | undefined {
    return this.getSnapshotByStep(-1);
  }

  redo(): ExerciseSnapshot | undefined {
    return this.getSnapshotByStep(1);
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  pushExerciseSnapshot(exerciseDocument: ExerciseDocument, taskId: string | undefined): void {
    this.history = this.history.slice(0, this.currentIndex + 1);

    const snapshotCopy: ExerciseSnapshot = structuredClone<ExerciseSnapshot>({
      selectedTaskId: taskId,
      exerciseDocument: exerciseDocument,
    });

    this.history.push(snapshotCopy);
    this.currentIndex = Math.max(this.currentIndex + 1, 0);
  }

  private getSnapshotByStep(directionStep: number): ExerciseSnapshot | undefined {
    const newIndex = this.currentIndex + directionStep;

    if (newIndex >= 0 && newIndex < this.history.length) {
      this.currentIndex = newIndex;
      return structuredClone(this.history[this.currentIndex]);
    }

    return undefined;
  }
}
