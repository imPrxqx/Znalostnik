import { Injectable, inject, signal, Signal, WritableSignal } from '@angular/core';
import { ExerciseDocumentHistoryManager } from './exercise-document-history-manager';
import { ExerciseDocumentManager } from './exercise-document-manager';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise-task-block.interface';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseBlockTemplates } from '@shared/models/exercise-task-block-template.model';
import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';

@Injectable({
  providedIn: 'root',
})
export class ExerciseTaskEdit {
  private editTask: WritableSignal<ExerciseTask> | undefined;
  private exerciseHistoryService = inject(ExerciseDocumentHistoryManager);
  private exerciseDocumentService = inject(ExerciseDocumentManager);

  editExerciseTask(taskId: string): void {
    this.editTask = this.exerciseDocumentService.getExerciseTask(taskId);
  }

  getEditTask(): WritableSignal<ExerciseTask> | undefined {
    return this.editTask;
  }

  editFirstTask(): void {
    this.editTask = this.exerciseDocumentService.getExerciseTaskIndex(0);
  }

  changeTaskSchema(newSchema: ExerciseTaskDocumentSchemaKey): void {
    if (!this.editTask) {
      return;
    }

    const newDefaultTask: ExerciseTask = this.createDefaultBody(newSchema);
    newDefaultTask.id = this.editTask().id;

    this.editTask.set(newDefaultTask);
  }

  changeTaskBlockTemplate(part: string, newTemplate: ExerciseTaskBlockTemplateKey): void {
    const bodyDefaultTemplate = ExerciseBlockTemplates.find((t) => t.key === newTemplate);

    if (!this.editTask || !bodyDefaultTemplate) {
      return;
    }

    const blocks = [...this.editTask().exerciseTaskBlocks];
    const index = blocks.findIndex((block) => block.taskBlockSchema === part);

    if (index !== -1) {
      blocks[index] = {
        ...blocks[index],
        taskBlockTemplate: newTemplate,
        metadata: structuredClone(bodyDefaultTemplate.defaultMetadata),
      };
    }
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
