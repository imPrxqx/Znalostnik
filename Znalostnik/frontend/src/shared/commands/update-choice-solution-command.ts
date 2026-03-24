import { ChoiceOption, QuizTask } from '@shared/models/format';

export class UpdateChoiceSolutionCommand implements Command {
  private receiver: QuizTask;
  private backup: string;
  private newText: string;

  constructor(receiver: QuizTask, optionId: string) {
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
