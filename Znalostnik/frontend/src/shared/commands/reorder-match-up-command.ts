import { Command } from '@shared/interfaces/command.interface';
import { MatchUpSolution } from '@shared/models/match-up';

export class ReorderMatchUpCommand implements Command {
  private receiver: MatchUpSolution;
  private backupFrom: number;
  private backupTo: number;
  private fromIndex: number;
  private toIndex: number;
  private position: 'left' | 'right';

  constructor(
    receiver: MatchUpSolution,
    fromIndex: number,
    toIndex: number,
    position: 'left' | 'right',
  ) {
    this.receiver = receiver;
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
    this.position = position;
    this.backupFrom = toIndex;
    this.backupTo = fromIndex;
  }

  undo(): void {
    this.receiver.move(this.backupFrom, this.backupTo, this.position);
  }

  execute(): boolean {
    this.receiver.move(this.fromIndex, this.toIndex, this.position);
    return true;
  }
}
