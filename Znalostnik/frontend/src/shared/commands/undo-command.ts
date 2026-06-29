import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { Command } from '@shared/interfaces/command.interface';

export class UndoCommand implements Command {
  private receiver: CommandManager;

  constructor(receiver: CommandManager) {
    this.receiver = receiver;
  }

  undo(): void {
    this.receiver.redo();
  }

  execute(): boolean {
    this.receiver.undo();
    return false;
  }
}
