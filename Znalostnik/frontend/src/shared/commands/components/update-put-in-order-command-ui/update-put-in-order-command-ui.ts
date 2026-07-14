import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { AddChoicePutInOrderCommand } from '@shared/commands/add-choice-put-in-order-command';
import { RemoveChoicePutInOrderCommand } from '@shared/commands/remove-choice-put-in-order-command';
import { ReorderChoiceCommand } from '@shared/commands/reorder-choice-command';
import { FieldContext } from '@shared/interfaces/field-context';
import { MultiChoiceOption, ChoiceOption } from '@shared/models/blocks';
import { PutInOrderSolution } from '@shared/models/put-in-order';
import { EditChoice } from '@shared/blocks/edit-choice/edit-choice';

/**
 * Command component for editing put in order activity.
 * Allows adding, removing, and reordering choice options.
 * All changes are executed through commands.
 */
@Component({
  selector: 'app-update-put-in-order-command-ui',
  imports: [MatButtonModule, MatIconModule, EditChoice],
  templateUrl: './update-put-in-order-command-ui.html',
  styleUrl: './update-put-in-order-command-ui.scss',
})
export class UpdatePutInOrderCommandUi {
  field = input.required<
    FieldContext<{
      choices: MultiChoiceOption;
      solution: PutInOrderSolution;
    }>
  >();
  commandManager = inject(CommandManager);

  getOptionById(id: string): ChoiceOption {
    return this.field().value.choices.options.find((o) => o.id === id)!;
  }

  onReorder(fromIndex: number, toIndex: number) {
    const command = new ReorderChoiceCommand(this.field().value.solution, fromIndex, toIndex);
    console.log(command);
    this.commandManager.execute(command);
  }

  moveUp(index: number) {
    if (index === 0) {
      return;
    }

    this.onReorder(index, index - 1);
  }

  moveDown(index: number) {
    const len = this.field().value.choices.options.length;

    if (index === len - 1) {
      return;
    }

    this.onReorder(index, index + 1);
  }

  addOption() {
    const command = new AddChoicePutInOrderCommand(
      this.field().value.choices,
      this.field().value.solution,
    );
    this.commandManager.execute(command);
  }

  removeLastOption() {
    const command = new RemoveChoicePutInOrderCommand(
      this.field().value.choices,
      this.field().value.solution,
      this.field().value.choices.options[this.field().value.choices.options.length - 1],
    );
    this.commandManager.execute(command);
  }
}
