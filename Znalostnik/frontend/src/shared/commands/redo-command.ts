import { CommandManager } from '@features/exercise-editor/services/command-manager';

export class RedoCommand implements Command {
  private receiver: CommandManager;

  constructor(receiver: CommandManager) {
    this.receiver = receiver;
  }

  undo(): void {
    this.receiver.undo();
  }

  execute(): boolean {
    this.receiver.redo();
    return false;
  }
}
