import { Command } from '@shared/interfaces/command.interface';
import { ChoiceOption, Media } from '@shared/models/format';

export class UpdateChoiceMediaCommand implements Command {
  private receiver: ChoiceOption;
  private backup: Media | undefined;
  private newMedia: Media;

  constructor(receiver: ChoiceOption, newMedia: Media) {
    this.receiver = receiver;
    this.backup = receiver.media();
    this.newMedia = newMedia;
  }

  undo(): void {
    this.receiver.setMedia(this.backup);
  }

  execute(): boolean {
    this.receiver.setMedia(this.newMedia);
    return true;
  }
}
