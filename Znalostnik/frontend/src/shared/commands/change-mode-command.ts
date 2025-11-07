import { EditorManager } from '@features/exercise-editor/services/editor-manager';

export class ChangeModeComponent implements Command {
  private receiver: EditorManager;
  private backup: string;
  private newMode: string;

  constructor(receiver: EditorManager, newMode: string) {
    this.receiver = receiver;
    this.backup = receiver.mode();
    this.newMode = newMode;
  }

  undo(): void {
    this.receiver.setMode(this.backup);
  }

  execute(): boolean {
    this.receiver.setMode(this.newMode);
    return true;
  }
}
