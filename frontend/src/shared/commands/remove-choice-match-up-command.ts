import { Command } from '@shared/interfaces/command.interface';
import { MultiChoiceOption, ChoiceOption } from '@shared/models/blocks';
import { MatchUpSolution, PairItem } from '@shared/models/match-up';

/**
 * Command for removing a choice option from match up activity.
 */
export class RemoveChoiceMatchUpCommand implements Command {
  private receiver0: MultiChoiceOption;
  private receiver1: MultiChoiceOption;
  private receiver2: MatchUpSolution;
  private backup1: ChoiceOption;
  private backup2: ChoiceOption;

  constructor(
    receiver0: MultiChoiceOption,
    receiver1: MultiChoiceOption,
    receiver2: MatchUpSolution,
    backup1: ChoiceOption,
    backup2: ChoiceOption,
  ) {
    this.receiver0 = receiver0;
    this.receiver1 = receiver1;
    this.receiver2 = receiver2;
    this.backup1 = backup1;
    this.backup2 = backup2;
  }

  undo(): void {
    this.receiver0.addOption(this.backup1);
    this.receiver1.addOption(this.backup2);
    const newPair: PairItem = { leftId: this.backup1.id, rightId: this.backup2.id };
    this.receiver2.correct.push(newPair);
  }

  execute(): boolean {
    this.receiver0.removeOptionById(this.backup1.id);
    this.receiver1.removeOptionById(this.backup2.id);
    this.receiver2.correct = this.receiver2.correct.filter(
      (pair) => pair.leftId !== this.backup1.id && pair.rightId !== this.backup2.id,
    );
    return true;
  }
}
