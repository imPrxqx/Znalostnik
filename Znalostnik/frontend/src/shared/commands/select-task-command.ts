import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';

export class SelectTaskCommand implements Command {
  private receiver: ExerciseTaskEdit;

  private backup: string | undefined;
  private newTaskId: string;

  constructor(receiver: ExerciseTaskEdit, newTaskId: string) {
    this.receiver = receiver;
    this.backup = receiver.getEditTask()?.id();
    this.newTaskId = newTaskId;
  }

  undo(): void {
    this.receiver.editTask(this.backup!);
  }

  execute(): boolean {
    this.receiver.editTask(this.newTaskId);
    return true;
  }
}
