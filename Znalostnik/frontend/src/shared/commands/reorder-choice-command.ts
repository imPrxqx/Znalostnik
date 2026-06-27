import { PutInOrderSolution } from '@shared/models/put-in-order';

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
