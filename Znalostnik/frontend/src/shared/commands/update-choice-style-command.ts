import { ChoiceOption, ChoiceStyle } from '@shared/models/format';

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
