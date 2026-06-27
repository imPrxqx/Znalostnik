import { ChoiceOption, Style } from '@shared/models/format';

export class UpdateChoiceStyleCommand implements Command {
  private receiver: ChoiceOption;
  private backup: Style;
  private newText: Style;

  constructor(receiver: ChoiceOption, newText: Style) {
    this.receiver = receiver;
    this.backup = receiver.style;
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
