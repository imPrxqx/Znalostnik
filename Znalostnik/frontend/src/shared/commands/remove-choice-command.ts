import { ChoiceOption, MultiChoiceOption } from '@shared/models/format';

export class RemoveChoiceCommand implements Command {
  private receiver: MultiChoiceOption;
  private backup: ChoiceOption;

  constructor(receiver: MultiChoiceOption) {
    this.receiver = receiver;
    this.backup = receiver.options[receiver.options.length - 1];
  }

  undo(): void {
    this.receiver.addOption(this.backup);
  }

  execute(): boolean {
    this.receiver.removeOption();
    return true;
  }
}
