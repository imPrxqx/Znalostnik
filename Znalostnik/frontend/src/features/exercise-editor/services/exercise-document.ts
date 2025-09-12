import { inject, Injectable, Signal, signal } from '@angular/core';
import { DocumentSchemas } from '@shared/models/block-registry';
import { ExerciseDocumentModel } from '@shared/models/exercise-document.model';
import { TaskModel } from '@shared/models/task.model';
import { ExerciseHistory } from './exercise-history';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocument {
  private exerciseHistoryService = inject(ExerciseHistory);
  private exerciseDocument = signal<ExerciseDocumentModel>({ tasks: [] });
  private selectedTasks = signal<TaskModel[] | undefined>(undefined);
  private isEditingMode = signal<boolean>(true);

  setSelectedTasksByIds(
    taskIds: string[] | undefined,
    skipExerciseSnapshot: boolean = false,
  ): void {
    if (!taskIds || taskIds.length === 0) {
      this.selectedTasks.set(undefined);
      return;
    }

    const tasks: TaskModel[] = taskIds
      .map((id) => this.exerciseDocument().tasks.find((t) => t.id === id))
      .filter((t): t is TaskModel => !!t);
    this.selectedTasks.set(tasks);

    if (!skipExerciseSnapshot) {
      this.saveExerciseSnapshot();
    }
  }

  setExerciseDocument(
    newDocument: ExerciseDocumentModel,
    skipExerciseSnapshot: boolean = false,
  ): void {
    this.exerciseDocument.set(newDocument);

    if (!skipExerciseSnapshot) {
      this.saveExerciseSnapshot();
    }
  }

  getExerciseDocument(): Signal<ExerciseDocumentModel> {
    return this.exerciseDocument;
  }

  getSelectedTasks(): Signal<TaskModel[] | undefined> {
    return this.selectedTasks;
  }

  getJson(): string {
    return JSON.stringify(this.exerciseDocument());
  }

  loadFromJson(jsonExerciseDocument: string): void {
    try {
      const parsedExercise: ExerciseDocumentModel = JSON.parse(jsonExerciseDocument);
      this.setExerciseDocument(parsedExercise);
    } catch {
      console.error('Invalid JSON');
    }
  }

  private saveExerciseSnapshot(): void {
    this.exerciseHistoryService.pushExerciseSnapshot(
      this.exerciseDocument(),
      this.selectedTasks()?.map((task) => task.id),
    );
  }
}
