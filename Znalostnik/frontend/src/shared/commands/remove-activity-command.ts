import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { Activity } from '@shared/models/activity';

export class RemoveActivityCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private index: number;
  private activityId: string;
  private backup: Activity;

  constructor(receiver: ExerciseDocumentManager, activityId: string) {
    this.receiver = receiver;
    this.activityId = activityId;
    this.index = receiver.getActivityIndexById(activityId);
    this.backup = receiver.getActivityById(activityId)!;
  }

  undo(): void {
    this.receiver.addActivityAt(this.backup, this.index);
  }

  execute(): boolean {
    this.receiver.deleteActivityById(this.activityId);
    return true;
  }
}
