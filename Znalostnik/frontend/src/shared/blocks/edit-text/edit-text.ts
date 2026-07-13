import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { UpdateTextCommand } from '@shared/commands/update-text-command';
import { UpdateTextStyleCommand } from '@shared/commands/update-text-style-command';
import { Text, TextStyle } from '@shared/models/blocks';

@Component({
  selector: 'app-edit-text',
  imports: [
    MatIconModule,
    MatOptionModule,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-text.html',
  styleUrl: './edit-text.scss',
})
export class EditText {
  text = input.required<Text>();
  commandManager = inject(CommandManager);
  advancedOpen = signal(false);

  onTextChange(value: string) {
    const command = new UpdateTextCommand(this.text(), value);
    this.commandManager.execute(command);
  }

  updateStyle(newStyle: TextStyle) {
    const command = new UpdateTextStyleCommand(this.text(), newStyle);
    this.commandManager.execute(command);
  }

  setFont(font: string) {
    const style = structuredClone(this.text().style());
    style.fontFamily = font;
    this.updateStyle(style);
  }

  setFontSize(size: number) {
    const style = structuredClone(this.text().style());
    style.fontSize = size;
    this.updateStyle(style);
  }

  setColor(color: string) {
    const style = structuredClone(this.text().style());
    style.color = color;
    this.updateStyle(style);
  }

  toggleBold() {
    const style = structuredClone(this.text().style());
    style.bold = !style.bold;
    this.updateStyle(style);
  }

  toggleItalic() {
    const style = structuredClone(this.text().style());
    style.italic = !style.italic;
    this.updateStyle(style);
  }

  toggleUnderline() {
    const style = structuredClone(this.text().style());
    style.underline = !style.underline;
    this.updateStyle(style);
  }

  toggleAdvanced() {
    this.advancedOpen.set(!this.advancedOpen());
  }
}
