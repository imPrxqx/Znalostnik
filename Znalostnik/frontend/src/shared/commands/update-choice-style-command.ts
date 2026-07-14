import { Command } from '@shared/interfaces/command.interface';
import { ChoiceOption, ChoiceStyle } from '@shared/models/blocks';

/**
 * Command for updating choice option block used in activites.
 */
export class UpdateChoiceStyleCommand implements Command {
  private receiver: ChoiceOption;
  private backup: ChoiceStyle;
  private newText: ChoiceStyle;

  constructor(receiver: ChoiceOption, newText: ChoiceStyle) {
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
