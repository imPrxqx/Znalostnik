import { Command } from '@shared/interfaces/command.interface';
import { MultiChoiceOption, ChoiceOption } from '@shared/models/format';
import { MatchUpSolution, PairItem } from '@shared/models/match-up';

export class AddChoiceMatchUpCommand implements Command {
  private receiver0: MultiChoiceOption;
  private receiver1: MultiChoiceOption;
  private receiver2: MatchUpSolution;
  private backup1: ChoiceOption;
  private backup2: ChoiceOption;
  constructor(
    receiver0: MultiChoiceOption,
    receiver1: MultiChoiceOption,
    receiver2: MatchUpSolution,
  ) {
    this.receiver0 = receiver0;
    this.receiver1 = receiver1;
    this.receiver2 = receiver2;
    this.backup1 = new ChoiceOption(undefined);
    this.backup2 = new ChoiceOption(undefined);
  }

  undo(): void {
    this.receiver0.removeOption();
    this.receiver1.removeOption();
    this.receiver2.correct = this.receiver2.correct.filter(
      (pair) => pair.leftId !== this.backup1.id && pair.rightId !== this.backup2.id,
    );
  }

  execute(): boolean {
    this.receiver0.addOption(this.backup1);
    this.receiver1.addOption(this.backup2);
    const newPair: PairItem = { leftId: this.backup1.id, rightId: this.backup2.id };
    this.receiver2.correct.push(newPair);
    return true;
  }
}
