import { Component, inject, input } from '@angular/core';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { FieldContext } from '@shared/interfaces/field-context';
import { Text } from '@shared/models/blocks';
import { MatIconModule } from '@angular/material/icon';
import { EditText } from '@shared/blocks/edit-text/edit-text';

/**
 * Command component for editing text block in activities.
 * All changes are executed through commands.
 */
@Component({
  selector: 'app-update-text-command-ui',
  imports: [MatIconModule, EditText],
  templateUrl: './update-text-command-ui.html',
  styleUrl: './update-text-command-ui.scss',
})
export class UpdateTextCommandUi {
  field = input.required<FieldContext<Text>>();
  commandManager = inject(CommandManager);
}
