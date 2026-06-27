import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { ExerciseActivityEdit } from '@features/exercise-editor/services/exercise-activity-edit';
import { Activity } from '@shared/models/activity';

export class CreateSelectActivityCommand implements Command {
  private receiver1: ExerciseDocumentManager;
  private receiver2: ExerciseActivityEdit;

  private backup: Activity | undefined;
  private newActivitySchema: string;

  constructor(
    receiver1: ExerciseDocumentManager,
    receiver2: ExerciseActivityEdit,
    newActivitySchema: string,
  ) {
    this.receiver1 = receiver1;
    this.receiver2 = receiver2;
    this.newActivitySchema = newActivitySchema;
  }

  undo(): void {
    if (this.backup) {
      this.receiver1.deleteActivity(this.backup);
    }
  }

  execute(): boolean {
    if (!this.backup) {
      const activity = this.receiver1.createActivity(this.newActivitySchema);
      activity.ensureSolution();
      this.backup = activity;
    }

    this.receiver1.addActivity(this.backup!);
    this.receiver2.editActivity(this.backup!.id());
    return true;
  }
}
