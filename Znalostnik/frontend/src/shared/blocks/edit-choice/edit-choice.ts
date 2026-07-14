import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { PickMediaDialog } from '@shared/commands/components/pick-media-dialog/pick-media-dialog';
import { UpdateChoiceCommand } from '@shared/commands/update-choice-command';
import { UpdateChoiceMediaCommand } from '@shared/commands/update-choice-media-command';
import { UpdateChoiceStyleCommand } from '@shared/commands/update-choice-style-command';
import { ChoiceOption, ChoiceStyle } from '@shared/models/blocks';


/**
 * Component for editing a choice option.
 * Block used for editing content, visual and media
 */
@Component({
  selector: 'app-edit-choice',
  imports: [
    MatIconModule,
    MatListModule,
    MatOptionModule,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-choice.html',
  styleUrl: './edit-choice.scss',
})
export class EditChoice {
  choice = input.required<ChoiceOption>();
  commandManager = inject(CommandManager);
  dialog = inject(MatDialog);
  advancedOpen = signal(false);

  onTextChange(value: string) {
    const command = new UpdateChoiceCommand(this.choice(), value);
    this.commandManager.execute(command);
  }

  updateStyle(newStyle: ChoiceStyle) {
    const command = new UpdateChoiceStyleCommand(this.choice(), newStyle);
    this.commandManager.execute(command);
  }

  setFont(font: string) {
    const style = structuredClone(this.choice().style());
    style.fontFamily = font;
    this.updateStyle(style);
  }

  setFontSize(size: number) {
    const style = structuredClone(this.choice().style());
    style.fontSize = size;
    this.updateStyle(style);
  }

  setColor(color: string) {
    const style = structuredClone(this.choice().style());
    style.color = color;
    this.updateStyle(style);
  }

  setBackgroundColor(color: string) {
    const style = structuredClone(this.choice().style());
    style.backgroundColor = color;
    this.updateStyle(style);
  }

  toggleBold() {
    const style = structuredClone(this.choice().style());
    style.bold = !style.bold;
    this.updateStyle(style);
  }

  toggleItalic() {
    const style = structuredClone(this.choice().style());
    style.italic = !style.italic;
    this.updateStyle(style);
  }

  toggleUnderline() {
    const style = structuredClone(this.choice().style());
    style.underline = !style.underline;
    this.updateStyle(style);
  }

  removeMedia() {
    const command = new UpdateChoiceMediaCommand(this.choice(), undefined);
    this.commandManager.execute(command);
  }

  /**
   * Opens a dialog for managing and selecting media for current option
   */
  openMediaDialog() {
    const ref = this.dialog.open(PickMediaDialog, {
      width: '1000px',
      maxWidth: '1000px',
    });

    ref.afterClosed().subscribe((media) => {
      if (!media) {
        return;
      }
      const command = new UpdateChoiceMediaCommand(this.choice(), media);
      this.commandManager.execute(command);
    });
  }

  toggleAdvanced() {
    this.advancedOpen.set(!this.advancedOpen());
  }
}
