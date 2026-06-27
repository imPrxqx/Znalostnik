import { MultiChoiceSolution } from '@shared/models/quiz';

export class UpdateChoiceSolutionCommand implements Command {
  private receiver: MultiChoiceSolution;
  private backup: string;
  private newText: string;

  constructor(receiver: MultiChoiceSolution, optionId: string) {
    this.receiver = receiver;
    this.backup = optionId;
    this.newText = optionId;
  }

  undo(): void {
    this.receiver.setSolution(this.backup);
  }

  execute(): boolean {
    this.receiver.setSolution(this.newText);
    return true;
  }
}
