import { Command, MergeableCommand } from '@shared/interfaces/command.interface';
import { Text } from '@shared/models/blocks';

/**
 * Command for updating text block used in activites as assignment.
 */
export class UpdateTextCommand implements Command, MergeableCommand {
  private mergeCount = 1;
  private receiver: Text;
  private backup: string;
  private newText: string;

  constructor(receiver: Text, newText: string) {
    this.receiver = receiver;
    this.backup = receiver.text();
    this.newText = newText;
  }

  undo(): void {
    this.receiver.setContent(this.backup);
  }

  execute(): boolean {
    this.receiver.setContent(this.newText);
    return true;
  }

  canMergeWith(other: Command): boolean {
    return (
      other instanceof UpdateTextCommand && other.receiver === this.receiver && this.mergeCount < 5
    );
  }

  mergeWith(other: Command): void {
    if (!(other instanceof UpdateTextCommand)) {
      return;
    }

    this.newText = other.newText;
    this.mergeCount++;
  }
}
