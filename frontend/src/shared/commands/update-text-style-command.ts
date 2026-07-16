import { Command } from '@shared/interfaces/command.interface';
import { Text, TextStyle } from '@shared/models/blocks';

/**
 * Command for updating the style of a text block.
 */
export class UpdateTextStyleCommand implements Command {
  private receiver: Text;
  private backup: TextStyle;
  private newText: TextStyle;

  constructor(receiver: Text, newText: TextStyle) {
    this.receiver = receiver;
    this.backup = receiver.style();
    this.newText = newText;
  }

  undo(): void {
    this.receiver.setStyle(this.backup);
  }

  execute(): boolean {
    this.receiver.setStyle(this.newText);
    return true;
  }
}
