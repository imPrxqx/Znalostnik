import { Command } from '@shared/interfaces/command.interface';
import { PutInOrderSolution } from '@shared/models/put-in-order';

/**
 * Command for changing the order of items in a put in order activity solution.
 */
export class ReorderChoiceCommand implements Command {
  private receiver: PutInOrderSolution;
  private backupFrom: number;
  private backupTo: number;
  private fromIndex: number;
  private toIndex: number;

  constructor(receiver: PutInOrderSolution, fromIndex: number, toIndex: number) {
    this.receiver = receiver;
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
    this.backupFrom = toIndex;
    this.backupTo = fromIndex;
  }

  undo(): void {
    this.receiver.move(this.backupFrom, this.backupTo);
  }

  execute(): boolean {
    this.receiver.move(this.fromIndex, this.toIndex);
    return true;
  }
}
