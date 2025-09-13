import { Injectable } from '@angular/core';
import { IExerciseSnapshot } from '../interfaces/exercise-snapshot.interface';
import { IExerciseDocument } from '@shared/interfaces/exercise-document.interface';

@Injectable({
  providedIn: 'root',
})
export class ExerciseHistory {
  private currentIndex: number = -1;
  private history: IExerciseSnapshot[] = [];

  undo(): IExerciseSnapshot | undefined {
    return this.getSnapshotByStep(-1);
  }

  redo(): IExerciseSnapshot | undefined {
    return this.getSnapshotByStep(1);
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  pushExerciseSnapshot(exerciseDocument: IExerciseDocument, taskId: string | undefined): void {
    this.history = this.history.slice(0, this.currentIndex + 1);

    const snapshotCopy: IExerciseSnapshot = structuredClone<IExerciseSnapshot>({
      selectedTaskId: taskId,
      exerciseDocument: exerciseDocument,
    });

    this.history.push(snapshotCopy);
    this.currentIndex = Math.max(this.currentIndex + 1, 0);
  }

  private getSnapshotByStep(directionStep: number): IExerciseSnapshot | undefined {
    const newIndex = this.currentIndex + directionStep;

    if (newIndex >= 0 && newIndex < this.history.length) {
      this.currentIndex = newIndex;
      return structuredClone(this.history[this.currentIndex]);
    }

    return undefined;
  }
}
