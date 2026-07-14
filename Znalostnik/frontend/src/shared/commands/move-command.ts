import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { Command } from '@shared/interfaces/command.interface';

/**
 * Command for moving activity to different position in exercise.
 */
export class MoveCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private backup: number;
  private newIndex: number;

  constructor(receiver: ExerciseDocumentManager, indexPrevious: number, indexNext: number) {
    this.receiver = receiver;
    this.backup = indexPrevious;
    this.newIndex = indexNext;
  }

  undo(): void {
    this.receiver.moveActivity(this.newIndex, this.backup);
  }

  execute(): boolean {
    this.receiver.moveActivity(this.backup, this.newIndex);
    return true;
  }
}
