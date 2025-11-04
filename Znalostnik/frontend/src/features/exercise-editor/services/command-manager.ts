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
}
