import { Command } from '@shared/interfaces/command.interface';
import { ChoiceOption, MultiChoiceOption } from '@shared/models/format';

export class AddChoiceCommand implements Command {
  private receiver: MultiChoiceOption;

  constructor(receiver: MultiChoiceOption) {
    this.receiver = receiver;
  }

  undo(): void {
    this.receiver.removeOption();
  }

  execute(): boolean {
    const newOption = new ChoiceOption(undefined);
    this.receiver.addOption(newOption);
    return true;
  }
}
