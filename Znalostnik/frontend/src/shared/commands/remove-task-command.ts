import { Component, input, WritableSignal } from '@angular/core';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise-task-block.interface';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';

export class RemoveTaskCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private taskId: string;
  private backup: WritableSignal<ExerciseTask>;

  constructor(receiver: ExerciseDocumentManager, taskId: string) {
    this.receiver = receiver;
    this.taskId = taskId;
    this.backup = receiver.getExerciseTask(taskId);
  }

  undo(): void {
    this.receiver.addTask(this.backup);
  }

  execute(): void {
    console.log('removing task', this.taskId);
    this.receiver.removeTask(this.taskId);
  }
}
