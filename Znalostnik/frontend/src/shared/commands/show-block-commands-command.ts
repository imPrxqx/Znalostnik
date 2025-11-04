import { ToolbarSupport, ToolbarOutput } from '@shared/models/format';
import { ToolbarManager } from '@features/exercise-editor/services/toolbar-manager';

export class ShowBlockCommands implements Command {
  private receiver: ToolbarManager;
  private commands: ToolbarSupport<any>;
  result: ToolbarOutput<any> | undefined;

  constructor(receiver: ToolbarManager, commands: ToolbarSupport<any>) {
    this.receiver = receiver;
    this.commands = commands;
  }

  undo(): void {
    this.receiver.clear();
  }

  execute(): boolean {
    const commands = this.commands.getToolbarCommands();
    this.receiver.setCommands(commands);
    return false;
  }
}
