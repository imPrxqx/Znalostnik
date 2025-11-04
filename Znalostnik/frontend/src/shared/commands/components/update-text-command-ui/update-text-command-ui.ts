import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { UpdateTextCommand } from '@shared/commands/update-text-command';
import { TextFormat, CommandUiComponent } from '@shared/models/format';

@Component({
  selector: 'app-update-text-command-ui',
  imports: [],
  templateUrl: './update-text-command-ui.html',
  styleUrl: './update-text-command-ui.css',
})
export class UpdateTextCommandUi implements CommandUiComponent<TextFormat> {
  format = input.required<TextFormat>();
  commands = output<Command>();

  currentText: string = '';

  onInputChange(value: string) {
    this.currentText = value;
  }

  apply() {
    const cmd = new UpdateTextCommand(this.format(), this.currentText);
    this.commands.emit(cmd);
  }
}
