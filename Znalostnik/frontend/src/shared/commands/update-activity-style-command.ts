import { Command } from '@shared/interfaces/command.interface';
import { Activity, ActivityStyle } from '@shared/models/activity';

export class UpdateActivityStyleCommand implements Command {
  private receiver: Activity;
  private backup: ActivityStyle;
  private newStyle: ActivityStyle;

  constructor(receiver: Activity, newStyle: ActivityStyle) {
    this.receiver = receiver;
    this.backup = receiver.style();
    this.newStyle = newStyle;
  }

  undo(): void {
    this.receiver.setStyle(this.backup);
  }

  execute(): boolean {
    this.receiver.setStyle(this.newStyle);
    return true;
  }
}
