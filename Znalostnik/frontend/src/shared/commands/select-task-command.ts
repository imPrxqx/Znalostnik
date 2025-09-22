import { Component, input, WritableSignal } from '@angular/core';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise-task-block.interface';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';

export class SelectTaskCommand implements Command {
  private receiver: ExerciseTaskEdit;
  private taskId: string;
  private backup: string | undefined;

  constructor(receiver: ExerciseTaskEdit, taskId: string) {
    this.receiver = receiver;
    this.taskId = taskId;
  }

  undo(): void {
    if (this.backup !== undefined) {
      this.receiver.editExerciseTask(this.backup);
    }
  }

  execute(): void {
    this.receiver.editExerciseTask(this.taskId);
  }
}
