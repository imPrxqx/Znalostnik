import { inject, Injectable, Signal, signal, ɵPendingTasksInternal } from '@angular/core';
import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise-task-document-schema.interface';
import { ExerciseDocument } from '@shared/interfaces/exercise-document.interface';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { ExerciseDocumentHistoryManager } from './exercise-document-history-manager';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';
import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';
import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocumentManager {
  private exerciseHistoryService: ExerciseDocumentHistoryManager = inject(
    ExerciseDocumentHistoryManager,
  );
  private exerciseDocument = signal<ExerciseDocument>({ tasks: [] });
  private selectedTask = signal<ExerciseTask | undefined>(undefined);

  removeTask(taskId: string): void {}

  addNewTask(taskSchema: ExerciseTaskDocumentSchemaKey): void {}

  changeTaskSchema(taskId: string, newSchema: ExerciseTaskDocumentSchemaKey): void {}

  changeTaskBlockTemplate(
    taskId: string,
    blockSchema: ExerciseTaskBlockMetaKey,
    newTemplate: ExerciseTaskBlockTemplateKey,
  ): void {}

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

  getAsJson(): string {
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

  private setFirstTaskAsSelected(): void {
    const firstTaskId = this.exerciseDocument().tasks[0]?.id;
    this.setSelectedTaskById(firstTaskId, true);
  }
}
