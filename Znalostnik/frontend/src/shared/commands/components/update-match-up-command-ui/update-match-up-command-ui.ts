import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { AddChoiceMatchUpCommand } from '@shared/commands/add-choice-match-up-command';
import { RemoveChoiceMatchUpCommand } from '@shared/commands/remove-choice-match-up-command';
import { ReorderMatchUpCommand } from '@shared/commands/reorder-match-up-command';
import { FieldContext } from '@shared/interfaces/field-context';
import { MultiChoiceOption } from '@shared/models/format';
import { MatchUpSolution } from '@shared/models/match-up';
import { EditChoice } from '@shared/media/edit-choice/edit-choice';

@Component({
  selector: 'app-update-match-up-command-ui',
  imports: [MatButtonModule, MatIconModule, EditChoice],
  templateUrl: './update-match-up-command-ui.html',
  styleUrl: './update-match-up-command-ui.scss',
})
export class UpdateMatchUpCommandUi {
  field = input.required<
    FieldContext<{
      leftOptions: MultiChoiceOption;
      rightOptions: MultiChoiceOption;
      solution: MatchUpSolution;
    }>
  >();

  commandManager = inject(CommandManager);

  getOptionById(id: string) {
    const leftOption = this.field().value.leftOptions.options.find((o) => o.id === id);

    if (leftOption) {
      return leftOption;
    }

    const rightOption = this.field().value.rightOptions.options.find((o) => o.id === id);

    if (rightOption) {
      return rightOption;
    }
    return undefined;
  }

  onReorder(fromIndex: number, toIndex: number, position: 'left' | 'right') {
    const command = new ReorderMatchUpCommand(
      this.field().value.solution,
      fromIndex,
      toIndex,
      position,
    );
    this.commandManager.execute(command);
  }

  moveUp(index: number, position: 'left' | 'right') {
    if (index === 0) {
      return;
    }

    this.onReorder(index, index - 1, position);
  }

  moveDown(index: number, position: 'left' | 'right') {
    const len = this.field().value.rightOptions.options.length;

    if (index === len - 1) {
      return;
    }

    this.onReorder(index, index + 1, position);
  }

  addOption() {
    const command = new AddChoiceMatchUpCommand(
      this.field().value.leftOptions,
      this.field().value.rightOptions,
      this.field().value.solution,
    );
    this.commandManager.execute(command);
  }

  removeLastOption() {
    const leftLast = this.getOptionById(
      this.field().value.solution.correct[this.field().value.solution.correct.length - 1].leftId,
    )!;

    const rightLast = this.getOptionById(
      this.field().value.solution.correct[this.field().value.solution.correct.length - 1].rightId,
    )!;

    const commad = new RemoveChoiceMatchUpCommand(
      this.field().value.leftOptions,
      this.field().value.rightOptions,
      this.field().value.solution,
      leftLast,
      rightLast,
    );

    this.commandManager.execute(commad);
  }
}
