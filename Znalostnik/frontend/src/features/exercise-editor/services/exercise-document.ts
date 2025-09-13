import { inject, Injectable, Signal, signal, ɵPendingTasksInternal } from '@angular/core';
import { DocumentSchemas } from '@shared/models/block-registry';
import { IExerciseDocument } from '@shared/interfaces/exercise-document.interface';
import { IExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { ExerciseHistory } from './exercise-history';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocument {
  private exerciseHistoryService: ExerciseHistory = inject(ExerciseHistory);
  private exerciseDocument = signal<IExerciseDocument>({ tasks: [] });
  private selectedTask = signal<IExerciseTask | undefined>(undefined);
  private isEditingMode = signal<boolean>(true);

  setSelectedTaskById(taskId: string | undefined, skipExerciseSnapshot: boolean = false): void {
    if (!taskId) {
      this.selectedTask.set(undefined);
      return;
    }

    const task: IExerciseTask | undefined = this.exerciseDocument().tasks.find(
      (task) => task.id === taskId,
    );
    this.selectedTask.set(task);

    if (!skipExerciseSnapshot) {
      this.saveExerciseSnapshot();
    }
  }

  setExerciseDocument(newDocument: IExerciseDocument, skipExerciseSnapshot: boolean = false): void {
    this.exerciseDocument.set(newDocument);

    if (!skipExerciseSnapshot) {
      this.saveExerciseSnapshot();
    }
  }

  getExerciseDocument(): Signal<IExerciseDocument> {
    return this.exerciseDocument;
  }

  getSelectedTask(): Signal<IExerciseTask | undefined> {
    return this.selectedTask;
  }

  getJson(): string {
    return JSON.stringify(this.exerciseDocument());
  }

  loadFromJson(jsonExerciseDocument: string): void {
    try {
      const parsedExercise: IExerciseDocument = JSON.parse(jsonExerciseDocument);
      this.setExerciseDocument(parsedExercise);
    } catch {
      console.error('Invalid JSON');
    }
  }

  private saveExerciseSnapshot(): void {
    this.exerciseHistoryService.pushExerciseSnapshot(
      this.exerciseDocument(),
      this.selectedTask()?.id,
    );
  }
}
