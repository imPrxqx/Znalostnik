import { Command } from '@shared/interfaces/command.interface';
import { MultiChoiceOption, ChoiceOption } from '@shared/models/blocks';
import { PutInOrderSolution } from '@shared/models/put-in-order';

/**
 * Command for removing a choice option from a put in order activity.
 */
export class RemoveChoicePutInOrderCommand implements Command {
  private receiver1: MultiChoiceOption;
  private receiver2: PutInOrderSolution;
  private backup: ChoiceOption;

  constructor(receiver1: MultiChoiceOption, receiver2: PutInOrderSolution, backup: ChoiceOption) {
    this.receiver1 = receiver1;
    this.receiver2 = receiver2;
    this.backup = backup;
  }

  undo(): void {
    this.receiver1.addOption(this.backup);
    this.receiver2.setSolution(this.backup.id);
  }

  execute(): boolean {
    this.receiver1.removeOption();
    this.receiver2.setSolution(this.backup.id);
    return true;
  }
}
