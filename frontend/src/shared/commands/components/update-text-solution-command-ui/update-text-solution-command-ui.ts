import { Component, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { UpdateTextSolutionCommand } from '@shared/commands/update-text-solution-command';
import { FieldContext } from '@shared/interfaces/field-context';
import { TextSolution } from '@shared/models/guess';

/**
 * Component for editing the solution of guess activity.
 * All changes are executed through commands.
 */
@Component({
  selector: 'app-update-text-solution-command-ui',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './update-text-solution-command-ui.html',
  styleUrl: './update-text-solution-command-ui.scss',
})
export class UpdateTextSolutionCommandUi {
  field = input.required<FieldContext<TextSolution>>();
  commandManager = inject(CommandManager);

  onInputChange(value: string) {
    const command = new UpdateTextSolutionCommand(this.field().value, value);
    this.commandManager.execute(command);
  }
}
