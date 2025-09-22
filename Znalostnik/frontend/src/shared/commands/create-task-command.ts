import { Component, input, WritableSignal } from '@angular/core';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise-task-block.interface';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';

export class CreateTaskCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private taskSchema: ExerciseTaskDocumentSchemaKey;
  private backup: string | undefined;

  constructor(receiver: ExerciseDocumentManager, taskSchema: ExerciseTaskDocumentSchemaKey) {
    this.receiver = receiver;
    this.taskSchema = taskSchema;
  }

  undo(): void {
    if (this.backup !== undefined) {
      this.receiver.removeTask(this.backup);
    }
  }

  execute(): void {
    const taskId = this.receiver.createTask(this.taskSchema);
    this.backup = taskId;
  }
}
