import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { Exercise } from '@shared/models/format';

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
    this.receiver.move(this.newIndex, this.backup);
  }

  execute(): boolean {
    this.receiver.move(this.backup, this.newIndex);
    return true;
  }
}
