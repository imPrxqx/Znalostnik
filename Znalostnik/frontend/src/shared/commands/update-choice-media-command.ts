import { ChoiceOption, Style } from '@shared/models/format';

export class UpdateChoiceMediaCommand implements Command {
  private receiver: ChoiceOption;
  private backup: any;
  private newText: any;

  constructor(receiver: ChoiceOption, newText: any) {
    this.receiver = receiver;
    this.backup = receiver.media;
    this.newText = newText;
  }

  undo(): void {
    this.receiver.setMedia(this.backup.id, this.backup.contentType);
  }

  execute(): boolean {
    this.receiver.setMedia(this.newText.id, this.newText.contentType);
    console.log(this.receiver);
    return true;
  }
}
