import { ChoiceOption } from '@shared/models/format';

export class UpdateChoiceCommand implements Command {
  private mergeCount = 1;
  private receiver: ChoiceOption;
  private backup: string;
  private newText: string;

  constructor(receiver: ChoiceOption, newText: string) {
    this.receiver = receiver;
    this.backup = receiver.content;
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
      other instanceof UpdateChoiceCommand &&
      other.receiver === this.receiver &&
      this.mergeCount < 5
    );
  }

  mergeWith(other: Command): void {
    if (!(other instanceof UpdateChoiceCommand)) {
      return;
    }

    this.newText = other.newText;
    this.mergeCount++;
  }
}
