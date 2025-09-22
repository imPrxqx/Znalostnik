import { Component, inject } from '@angular/core';
import { input } from '@angular/core';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { RemoveTaskCommandUi } from '@shared/commands/components/remove-task-command-ui/remove-task-command-ui';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';

@Component({
  selector: 'app-exercise-task-item',
  imports: [RemoveTaskCommandUi],
  templateUrl: './exercise-task-item.html',
  styleUrl: './exercise-task-item.css',
})
export class ExerciseTaskItem {
  commandManager = inject(CommandManager);
  exerciseManager = inject(ExerciseDocumentManager);
  taskId = input.required<string>();

  execute(command: Command) {
    this.commandManager.execute(command);
  }
}
