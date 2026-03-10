import { Component, input, inject } from '@angular/core';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { AddChoiceCommand } from '@shared/commands/add-choice-command';
import { RemoveChoiceCommand } from '@shared/commands/remove-choice-command copy';
import { UpdateChoiceCommand } from '@shared/commands/update-choice-command';
import { MultiChoiceOption, QuizTask } from '@shared/models/format';

@Component({
  selector: 'app-update-multi-choice-command-ui',
  imports: [],
  templateUrl: './update-multi-choice-command-ui.html',
  styleUrl: './update-multi-choice-command-ui.scss',
})
export class UpdateMultiChoiceCommandUi {
  task = input.required<QuizTask>();
  commandManager = inject(CommandManager);
  currentTexts: string[] = [];

  ngAfterViewInit() {
    this.task()
      .options()
      .options.forEach((option, index) => {
        this.currentTexts[index] = option.content;
      });
  }

  onInputChange(index: number, value: string) {
    this.currentTexts[index] = value;
  }

  apply(index: number) {
    const option = this.task().options().options[index];
    const text = this.currentTexts[index];

    const command = new UpdateChoiceCommand(option, text);
    this.commandManager.execute(command);
  }

  static supports(item: any): boolean {
    if (!('options' in item)) {
      return false;
    }

    const value = item.options?.();
    return value instanceof MultiChoiceOption;
  }

  addOption() {
    const command = new AddChoiceCommand(this.task().options());
    this.commandManager.execute(command);
  }

  removeLastOption() {
    const command = new RemoveChoiceCommand(this.task().options());
    this.commandManager.execute(command);
  }
}
