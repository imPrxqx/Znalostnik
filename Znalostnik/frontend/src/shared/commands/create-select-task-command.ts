import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-key.type';
import { Task } from '@shared/models/format';

export class CreateSelectTaskCommand implements Command {
  private receiver1: ExerciseDocumentManager;
  private receiver2: ExerciseTaskEdit;

  private backup: Task | undefined;
  private newTaskSchema: ExerciseTaskDocumentSchemaKey;

  constructor(
    receiver1: ExerciseDocumentManager,
    receiver2: ExerciseTaskEdit,
    newTaskSchema: ExerciseTaskDocumentSchemaKey,
  ) {
    this.receiver1 = receiver1;
    this.receiver2 = receiver2;
    this.newTaskSchema = newTaskSchema;
  }

  undo(): void {
    if (this.backup) {
      this.receiver1.deleteTask(this.backup);
    }
  }

  execute(): boolean {
    if (!this.backup) {
      const task = this.receiver1.createTask(this.newTaskSchema);
      this.backup = task;
    }

    this.receiver1.addTask(this.backup);
    this.receiver2.editExerciseTask(this.backup.id());
    return true;
  }
}
