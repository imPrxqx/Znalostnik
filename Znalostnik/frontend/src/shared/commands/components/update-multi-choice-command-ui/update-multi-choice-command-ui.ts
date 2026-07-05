import { Component, input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { AddChoiceCommand } from '@shared/commands/add-choice-command';
import { RemoveChoiceCommand } from '@shared/commands/remove-choice-command';
import { UpdateChoiceSolutionCommand } from '@shared/commands/update-choice-solution-command';
import { FieldContext } from '@shared/interfaces/field-context';
import { MultiChoiceOption } from '@shared/models/format';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QuizSolution } from '@shared/models/quiz';
import { EditChoice } from '@shared/media/edit-choice/edit-choice';

@Component({
  selector: 'app-update-multi-choice-command-ui',
  imports: [MatButtonModule, MatIconModule, MatCheckboxModule, EditChoice],
  templateUrl: './update-multi-choice-command-ui.html',
  styleUrl: './update-multi-choice-command-ui.scss',
})
export class UpdateMultiChoiceCommandUi {
  field = input.required<
    FieldContext<{
      choices: MultiChoiceOption;
      solution: QuizSolution;
    }>
  >();

  commandManager = inject(CommandManager);

  isChecked(optionId: string): boolean {
    return this.field().value.solution.correct.includes(optionId);
  }

  onCheckboxChange(optionId: string) {
    const command = new UpdateChoiceSolutionCommand(this.field().value.solution, optionId);
    this.commandManager.execute(command);
  }

  addOption() {
    const command = new AddChoiceCommand(this.field().value.choices);
    this.commandManager.execute(command);
  }

  removeLastOption() {
    const command = new RemoveChoiceCommand(this.field().value.choices);
    this.commandManager.execute(command);
  }
}
