import { Command, MergeableCommand } from '@shared/interfaces/command.interface';
import { TextSolution } from '@shared/models/guess';

export class UpdateTextSolutionCommand implements Command, MergeableCommand {
  private mergeCount = 1;
  private receiver: TextSolution;
  private backup: string;
  private newText: string;

  constructor(receiver: TextSolution, newText: string) {
    this.receiver = receiver;
    this.backup = receiver.correct;
    this.newText = newText;
  }

  undo(): void {
    this.receiver.setSolution(this.backup);
  }

  execute(): boolean {
    this.receiver.setSolution(this.newText);
    return true;
  }

  canMergeWith(other: Command): boolean {
    return (
      other instanceof UpdateTextSolutionCommand &&
      other.receiver === this.receiver &&
      this.mergeCount < 5
    );
  }

  mergeWith(other: Command): void {
    if (!(other instanceof UpdateTextSolutionCommand)) {
      return;
    }

    this.newText = other.newText;
    this.mergeCount++;
  }
}
