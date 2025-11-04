import { CommandManager } from '@features/exercise-editor/services/command-manager';

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
