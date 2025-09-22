import { Component, input, output } from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { CommandUI } from '@shared/interfaces/command-ui.interface';
import { UpdateTextCommand } from '@shared/commands/update-text-command';

@Component({
  selector: 'app-update-text-command-ui',
  imports: [],
  templateUrl: './update-text-command-ui.html',
  styleUrl: './update-text-command-ui.css',
})
export class UpdateTextCommandUi implements CommandUI {
  receiver = input.required<TextBlock>();
  commandCreated = output<Command>();

  currentText: string = '';

  ngOnInit() {
    this.currentText = this.receiver().block()()?.metadata?.data?.['content'] ?? 'null';
  }

  onInputChange(value: string) {
    this.currentText = value;
  }

  apply() {
    const cmd = new UpdateTextCommand(this.receiver(), this.currentText);
    this.commandCreated.emit(cmd);
  }
}
