import { Command } from '@shared/interfaces/command.interface';
import { QuizSolution } from '@shared/models/quiz';

/**
 * Command for updating quiz activity solution.
 */
export class UpdateChoiceSolutionCommand implements Command {
  private receiver: QuizSolution;
  private backup: string;
  private newText: string;

  constructor(receiver: QuizSolution, optionId: string) {
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
