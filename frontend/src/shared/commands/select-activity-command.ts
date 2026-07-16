import { ExerciseActivityEdit } from '@features/exercise-editor/services/exercise-activity-edit';
import { Command } from '@shared/interfaces/command.interface';

/**
 * Command for selecting an activity for editing.
 */
export class SelectActivityCommand implements Command {
  private receiver: ExerciseActivityEdit;
  private backup: string | undefined;
  private newActivityId: string;

  constructor(receiver: ExerciseActivityEdit, newActivityId: string) {
    this.receiver = receiver;
    this.backup = receiver.getEditActivity()?.id();
    this.newActivityId = newActivityId;
  }

  undo(): void {
    this.receiver.editActivity(this.backup!);
  }

  execute(): boolean {
    this.receiver.editActivity(this.newActivityId);
    return true;
  }
}
