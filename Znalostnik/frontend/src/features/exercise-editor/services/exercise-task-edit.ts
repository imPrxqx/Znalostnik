import { Injectable, inject, signal, Signal, WritableSignal, linkedSignal } from '@angular/core';
import { ExerciseDocumentManager } from './exercise-document-manager';
import { Exercise, Task } from '@shared/models/format';

@Injectable({
  providedIn: 'root',
})
export class ExerciseTaskEdit {
  private exerciseDocumentService = inject(ExerciseDocumentManager);

  private lastSelectedTaskId: string | undefined = undefined;

  task = linkedSignal<Task[], Task | undefined>({
    source: this.exerciseDocumentService.getTasks(),
    computation: (source) => {
      if (source.length === 0) {
        this.lastSelectedTaskId = undefined;
        return undefined;
      }

      if (this.lastSelectedTaskId !== undefined) {
        const index = source.findIndex((task) => task.id() === this.lastSelectedTaskId);
        if (index !== -1) {
          return source[index];
        }
      }

      this.lastSelectedTaskId = source[0].id();
      return source[0];
    },
  });

  editTask(taskId: string): void {
    this.lastSelectedTaskId = taskId;
    this.task.set(this.exerciseDocumentService.getTaskById(taskId));
  }

  getEditTask(): Task | undefined {
    return this.task();
  }
}
