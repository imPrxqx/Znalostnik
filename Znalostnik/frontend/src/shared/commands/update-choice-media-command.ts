import { Command } from '@shared/interfaces/command.interface';
import { ChoiceOption, Media } from '@shared/models/blocks';

/**
 * Command for updating choice option by adding media.
 */
export class UpdateChoiceMediaCommand implements Command {
  private receiver: ChoiceOption;
  private backup: Media | undefined;
  private newMedia: Media | undefined;

  constructor(receiver: ChoiceOption, newMedia: Media | undefined) {
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
