import { Component, inject, input } from '@angular/core';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { QuizTask, Text } from '@shared/models/format';
import { UpdateTextCommand } from '@shared/commands/update-text-command';

@Component({
  selector: 'app-update-text-command-ui',
  imports: [],
  templateUrl: './update-text-command-ui.html',
  styleUrl: './update-text-command-ui.scss',
})
export class UpdateTextCommandUi {
  task = input.required<QuizTask>();
  commandManager = inject(CommandManager);
  currentText: string = '';

  ngAfterViewInit() {
    this.currentText = this.task().content().content;
  }

  onInputChange(value: string) {
    this.currentText = value;
  }

  apply() {
    const command = new UpdateTextCommand(this.task().content(), this.currentText);
    this.commandManager.execute(command);
  }

  static supports(item: any): boolean {
    if (!('content' in item)) {
      return false;
    }

    const value = item.content?.();
    return value instanceof Text;
  }
}
