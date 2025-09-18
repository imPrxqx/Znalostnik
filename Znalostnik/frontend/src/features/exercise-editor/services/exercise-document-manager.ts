import {
  inject,
  Injectable,
  Signal,
  WritableSignal,
  signal,
  ɵPendingTasksInternal,
} from '@angular/core';
import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise-task-document-schema.interface';
import { ExerciseDocument } from '@shared/interfaces/exercise-document.interface';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { ExerciseDocumentHistoryManager } from './exercise-document-history-manager';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';
import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';
import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';
import { ExerciseBlockTemplates } from '@shared/models/exercise-task-block-template.model';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise-task-block.interface';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocumentManager {
  private exerciseHistoryService: ExerciseDocumentHistoryManager = inject(
    ExerciseDocumentHistoryManager,
  );

  private tasks = signal<WritableSignal<ExerciseTask>[]>([]);

  addTask(taskSchema: ExerciseTaskDocumentSchemaKey): string {
    const newTask = this.createDefaultBody(taskSchema);
    this.tasks.update((list) => [...list, signal<ExerciseTask>(newTask)]);

    console.log('Document: ', this.tasks());
    console.log('Task ', newTask);

    const foundTask = this.tasks().find((t) => (t().id = newTask.id));

    if (foundTask) {
      console.log('Task in signal', foundTask());
    }

    return newTask.id;
  }

  private createDefaultBody(taskSchema: ExerciseTaskDocumentSchemaKey): ExerciseTask {
    const newTaskId = this.generateTaskId();

    const schema = ExerciseTaskDocumentSchemas.find((s) => s.key === taskSchema);

    if (!schema) {
      throw new Error(`Unknown task schema: ${taskSchema}`);
    }

    const blocks: ExerciseTaskBlock[] = schema.bodyMeta.map((blockMeta) => {
      const bodyTemplate = ExerciseBlockTemplates.find((t) => t.key === blockMeta.defaultTemplate);

      if (!bodyTemplate) {
        throw new Error(`Unknown template: ${bodyTemplate}`);
      }

      return {
        taskBlockSchema: blockMeta.key,
        taskBlockTemplate: blockMeta.defaultTemplate,
        metadata: structuredClone(bodyTemplate.defaultMetadata),
      };
    });

    const newTask: ExerciseTask = {
      id: newTaskId,
      exerciseTaskDocumentSchema: taskSchema,
      exerciseTaskBlocks: blocks,
    };

    return newTask;
  }

  private generateTaskId(): string {
    return 'task-' + Math.random().toString(36).substring(2, 7);
  }

  duplicateTask(taskId: string) {}

  removeTask(taskId: string): void {
    this.tasks.update((list) => list.filter((t) => t().id !== taskId));
  }

  setExerciseDocument(newDocument: ExerciseDocument, skipExerciseSnapshot: boolean = false): void {
    //this.exerciseDocument.set(newDocument);

    if (!skipExerciseSnapshot) {
      this.saveExerciseSnapshot();
    }
  }

  setSelectedTaskById(taskId: string, skipExerciseSnapshot: boolean = false): void {
    //const task = this.tasks().get(taskId);
    // const task: ExerciseTask | undefined = this.exerciseDocumentService.getExerciseDocument()().tasks.find(
    //   (task) => task.id === taskId,
    // );
    // this.selectedTask.set(task);
    // if (!skipExerciseSnapshot) {
    //   this.saveExerciseSnapshot();
    // }
  }

  // getExerciseDocument(): Signal<ExerciseDocument> {
  //   return this.exerciseDocument;
  // }

  getExerciseTask(taskId: string): WritableSignal<ExerciseTask> | undefined {
    return this.tasks().find((t) => t().id === taskId);
  }

  getExerciseTaskIndex(index: number): WritableSignal<ExerciseTask> | undefined {
    if (index < 0 || index >= this.tasks().length) {
      return undefined;
    }

    return this.tasks()[index];
  }

  private saveExerciseSnapshot(): void {
    // this.exerciseHistoryService.pushExerciseSnapshot(
    //   this.exerciseDocument(),
    //   this.selectedTask()?.id,
    // );
  }

  // private setFirstTaskAsSelected(): void {
  //   const firstTaskId = this.exerciseDocumentService.getExerciseDocument()().tasks[0]?.id;
  //   this.setSelectedTaskById(firstTaskId);
  // }
}

class ExerciseTaskSignal {
  task: Signal<ExerciseTask>;

  constructor(taskSchema: ExerciseTaskDocumentSchemaKey) {
    const defaultTask = this.createDefaultBody(taskSchema);
    this.task = signal<ExerciseTask>(defaultTask);
  }

  private createDefaultBody(taskSchema: ExerciseTaskDocumentSchemaKey): ExerciseTask {
    const newTaskId = this.generateTaskId();

    const schema = ExerciseTaskDocumentSchemas.find((s) => s.key === taskSchema);

    if (!schema) {
      throw new Error(`Unknown task schema: ${taskSchema}`);
    }

    const blocks: ExerciseTaskBlock[] = schema.bodyMeta.map((blockMeta) => {
      const bodyTemplate = ExerciseBlockTemplates.find((t) => t.key === blockMeta.defaultTemplate);

      if (!bodyTemplate) {
        throw new Error(`Unknown template: ${bodyTemplate}`);
      }

      return {
        taskBlockSchema: blockMeta.key,
        taskBlockTemplate: blockMeta.defaultTemplate,
        metadata: structuredClone(bodyTemplate.defaultMetadata),
      };
    });

    const newTask: ExerciseTask = {
      id: newTaskId,
      exerciseTaskDocumentSchema: taskSchema,
      exerciseTaskBlocks: blocks,
    };

    return newTask;
  }

  private generateTaskId(): string {
    return 'task-' + Math.random().toString(36).substring(2, 7);
  }
}
