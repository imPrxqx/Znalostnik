import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { Task } from '@shared/models/format';

export class RemoveTaskCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private index: number;
  private taskId: string;
  private backup: Task;

  constructor(receiver: ExerciseDocumentManager, taskId: string) {
    this.receiver = receiver;
    this.taskId = taskId;
    this.index = receiver.getTaskIndexById(taskId);
    this.backup = receiver.getTaskById(taskId)!;
  }

  undo(): void {
    this.receiver.addTaskAt(this.backup, this.index);
  }

  execute(): boolean {
    this.receiver.deleteTaskById(this.taskId);
    return true;
  }
}
