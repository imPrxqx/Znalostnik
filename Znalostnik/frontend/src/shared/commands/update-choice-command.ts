import { ChoiceOption } from '@shared/models/format';

export class UpdateChoiceCommand implements Command {
  private receiver: ChoiceOption;
  private backup: string;
  private newText: string;

  constructor(receiver: ChoiceOption, newText: string) {
    this.receiver = receiver;
    this.backup = receiver.content;
    this.newText = newText;
  }

  undo(): void {
    this.receiver.setContent(this.backup);
  }

  execute(): boolean {
    this.receiver.setContent(this.newText);
    return true;
  }
}
