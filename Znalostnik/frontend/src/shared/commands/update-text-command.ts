import { TextFormat } from '@shared/models/format';

export class UpdateTextCommand implements Command {
  private receiver: TextFormat;
  private backup: string;
  private newText: string;

  constructor(receiver: TextFormat, newText: string) {
    this.receiver = receiver;
    this.backup = receiver.getContent();
    this.newText = newText;
  }

  undo(): void {
    this.receiver.setContent(this.backup);
  }

  execute(): boolean {
    this.receiver.setContent(this.newText);
    return true;
  }
}
