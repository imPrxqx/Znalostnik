import { inject, Injectable, Signal, signal, ɵPendingTasksInternal } from '@angular/core';
import { DocumentSchemas } from '@shared/models/block-registry';
import { ExerciseDocument } from '@shared/interfaces/exercise-document.interface';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { ExerciseDocumentHistoryManager } from './exercise-document-history-manager';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocumentManager {
  private exerciseHistoryService: ExerciseDocumentHistoryManager = inject(
    ExerciseDocumentHistoryManager,
  );
  private exerciseDocument = signal<ExerciseDocument>({ tasks: [] });
  private selectedTask = signal<ExerciseTask | undefined>(undefined);
  private isEditingMode = signal<boolean>(true);

  setSelectedTaskById(taskId: string | undefined, skipExerciseSnapshot: boolean = false): void {
    if (!taskId) {
      this.selectedTask.set(undefined);
      return;
    }

    const task: ExerciseTask | undefined = this.exerciseDocument().tasks.find(
      (task) => task.id === taskId,
    );
    this.selectedTask.set(task);

    if (!skipExerciseSnapshot) {
      this.saveExerciseSnapshot();
    }
  }

  setExerciseDocument(newDocument: ExerciseDocument, skipExerciseSnapshot: boolean = false): void {
    this.exerciseDocument.set(newDocument);

    if (!skipExerciseSnapshot) {
      this.saveExerciseSnapshot();
    }
  }

  getExerciseDocument(): Signal<ExerciseDocument> {
    return this.exerciseDocument;
  }

  getSelectedTask(): Signal<ExerciseTask | undefined> {
    return this.selectedTask;
  }

  getJson(): string {
    return JSON.stringify(this.exerciseDocument());
  }

  loadFromJson(jsonExerciseDocument: string): void {
    try {
      const parsedExercise: ExerciseDocument = JSON.parse(jsonExerciseDocument);
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
