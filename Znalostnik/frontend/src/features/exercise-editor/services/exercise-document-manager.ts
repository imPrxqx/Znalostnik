import {
  inject,
  Injectable,
  Signal,
  WritableSignal,
  signal,
  linkedSignal,
  ɵPendingTasksInternal,
} from '@angular/core';
import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise-task-document-schema.interface';
import { ExerciseDocument } from '@shared/interfaces/exercise-document.interface';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
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
  tasks = signal<WritableSignal<ExerciseTask>[]>([]);

  addTask(task: WritableSignal<ExerciseTask>, index: number = this.tasks().length) {
    const currentTasks = [...this.tasks()];
    currentTasks.splice(index, 0, task);
    this.tasks.set(currentTasks);
  }

  createTask(taskSchema: ExerciseTaskDocumentSchemaKey): string {
    const newTask = this.createDefaultBody(taskSchema);
    const newSignal = signal<ExerciseTask>(newTask);
    this.tasks.update((list) => [...list, newSignal]);

    console.log('DOCUMENT', this.tasks());
    for (const taskSignal of this.tasks()) {
      console.log(taskSignal().id);
    }

    return newTask.id;
  }

  private createDefaultBody(taskSchema: ExerciseTaskDocumentSchemaKey): ExerciseTask {
    const newTaskId = this.generateTaskId();

    const schema = ExerciseTaskDocumentSchemas.find((s) => s.key === taskSchema);

    if (!schema) {
      throw new Error(`Unknown task schema: ${taskSchema}`);
    }

    const blocks: WritableSignal<ExerciseTaskBlock>[] = schema.bodyMeta.map((blockMeta) => {
      const bodyTemplate = ExerciseBlockTemplates.find((t) => t.key === blockMeta.defaultTemplate);

      if (!bodyTemplate) {
        throw new Error(`Unknown template: ${bodyTemplate}`);
      }

      const taskBlock = signal<ExerciseTaskBlock>({
        taskBlockSchema: blockMeta.key,
        taskBlockTemplate: blockMeta.defaultTemplate,
        metadata: structuredClone(bodyTemplate.defaultMetadata),
      });

      return taskBlock;
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

  getExerciseTask(taskId: string): WritableSignal<ExerciseTask> {
    const task = this.tasks().find((t) => t().id === taskId);

    if (!task) {
      throw new Error(`Task with ${taskId} doesnt exists`);
    }

    return task;
  }

  getExerciseTaskIndex(index: number): WritableSignal<ExerciseTask> {
    if (index < 0 || index >= this.tasks().length) {
      throw new Error(`Task with index ${index} doesnt exists`);
    }

    return this.tasks()[index];
  }

  getExerciseTasks(): WritableSignal<WritableSignal<ExerciseTask>[]> {
    return this.tasks;
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

    const blocks: WritableSignal<ExerciseTaskBlock>[] = schema.bodyMeta.map((blockMeta) => {
      const bodyTemplate = ExerciseBlockTemplates.find((t) => t.key === blockMeta.defaultTemplate);

      if (!bodyTemplate) {
        throw new Error(`Unknown template: ${bodyTemplate}`);
      }

      const taskBlock = signal<ExerciseTaskBlock>({
        taskBlockSchema: blockMeta.key,
        taskBlockTemplate: blockMeta.defaultTemplate,
        metadata: structuredClone(bodyTemplate.defaultMetadata),
      });

      return taskBlock;
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
