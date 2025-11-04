import { Injectable, inject, signal, Signal, WritableSignal, linkedSignal } from '@angular/core';
import { ExerciseDocumentManager } from './exercise-document-manager';
import { ExerciseTask } from '@shared/interfaces/exercise/exercise-task.interface';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise/exercise-task-block.interface';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseBlockTemplates } from '@shared/models/exercise-task-block-template.model';
import {
  ExerciseTaskBlockTemplateKey,
  ExerciseTaskDocumentSchemaKey,
} from '@shared/types/exercise-key.type';
import { Exercise, Task } from '@shared/models/format';

@Injectable({
  providedIn: 'root',
})
export class ExerciseTaskEdit {
  private exerciseDocumentService = inject(ExerciseDocumentManager);

  private lastSelectedIndex: number | undefined = undefined;
  task = linkedSignal<Task[], Task | undefined>({
    source: this.exerciseDocumentService.getTasks(),
    computation: (source) => {
      console.log('TASK EDIT COMPUTATION', source, this.lastSelectedIndex);

      if (source.length === 0) {
        return undefined;
      }
      if (this.lastSelectedIndex !== undefined && this.lastSelectedIndex < source.length) {
        return source[this.lastSelectedIndex];
      }

      this.lastSelectedIndex = source.length - 1;

      return source[this.lastSelectedIndex];
    },
  });

  editExerciseTask(taskId: string): void {
    //this.task.set(this.exerciseDocumentService.getExerciseTask(taskId));
  }

  getEditTask(): Task | undefined {
    return this.task();
  }

  editFirstTask(): void {}

  changeTaskSchema(newSchema: ExerciseTaskDocumentSchemaKey): void {}

  changeTaskBlockTemplate(part: string, newTemplate: ExerciseTaskBlockTemplateKey): void {}
}
