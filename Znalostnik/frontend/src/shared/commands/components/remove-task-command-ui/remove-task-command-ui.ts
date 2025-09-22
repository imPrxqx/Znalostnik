import { Component, inject, input, output } from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { CommandUI } from '@shared/interfaces/command-ui.interface';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { RemoveTaskCommand } from '@shared/commands/remove-task-command';
@Component({
  selector: 'app-remove-task-command-ui',
  imports: [],
  templateUrl: './remove-task-command-ui.html',
  styleUrl: './remove-task-command-ui.css',
})
export class RemoveTaskCommandUi implements CommandUI {
  receiver = input.required<ExerciseDocumentManager>();
  taskId = input.required<string>();
  commandCreated = output<Command>();

  remove() {
    const cmd = new RemoveTaskCommand(this.receiver(), this.taskId());
    this.commandCreated.emit(cmd);
  }
}
