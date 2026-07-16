import { Command } from '@shared/interfaces/command.interface';
import { ChoiceOption, MultiChoiceOption } from '@shared/models/blocks';

/**
 * Command for removing a choice option from a multiple choice block.
 */
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
