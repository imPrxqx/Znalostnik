import { Injectable, inject, effect } from '@angular/core';
import { ExerciseDocument } from './exercise-document';
import { ExerciseSnapshotModel } from '../models/exercise-snapshot';
import { TaskModel } from '@shared/models/task.model';
import { ExerciseDocumentModel } from '@shared/models/exercise-document.model';

@Injectable({
  providedIn: 'root',
})
export class ExerciseHistory {
  private currentIndex: number = -1;
  private history: ExerciseSnapshotModel[] = [];

  undo(): ExerciseSnapshotModel | undefined {
    return this.getSnapshotByStep(-1);
  }

  redo(): ExerciseSnapshotModel | undefined {
    return this.getSnapshotByStep(1);
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  pushExerciseSnapshot(
    exerciseDocument: ExerciseDocumentModel,
    taskIds: string[] | undefined,
  ): void {
    this.history = this.history.slice(0, this.currentIndex + 1);

    const snapshotCopy: ExerciseSnapshotModel = structuredClone<ExerciseSnapshotModel>({
      selectedTaskIds: taskIds,
      exerciseDocument: exerciseDocument,
    });

    this.history.push(snapshotCopy);
    this.currentIndex = Math.max(this.currentIndex + 1, 0);
  }

  private getSnapshotByStep(directionStep: number): ExerciseSnapshotModel | undefined {
    const newIndex = this.currentIndex + directionStep;

    if (newIndex >= 0 && newIndex < this.history.length) {
      this.currentIndex = newIndex;
      return structuredClone(this.history[this.currentIndex]);
    }

    return undefined;
  }
}
