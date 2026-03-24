import { inject, Injectable } from '@angular/core';
import { CommandHistory } from './command-history';

@Injectable({
  providedIn: 'root',
})
export class CommandManager {
  private history = inject(CommandHistory);
  private backup: Command[] = [];

  execute(command: Command) {
    if (command.execute()) {
      const last = this.history.history[this.history.history.length - 1];

      if (last && this.isMergeable(last) && last.canMergeWith(command)) {
        last.mergeWith(command);
        return;
      }

      this.history.push(command);
      this.backup = [];
    }
  }

  undo() {
    const command = this.history.pop();

    if (command !== undefined) {
      command.undo();
      this.backup.push(command);
    }
  }

  redo() {
    const backupCommand = this.backup.pop();

    if (backupCommand !== undefined) {
      backupCommand.execute();
      this.history.push(backupCommand);
    }
  }

  private isMergeable(cmd: Command): cmd is Command & MergeableCommand {
    return 'canMergeWith' in cmd && 'mergeWith' in cmd;
  }
}
