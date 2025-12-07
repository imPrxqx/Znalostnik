import { Component, inject } from '@angular/core';
import { input } from '@angular/core';
import { ExerciseTask } from '@shared/interfaces/exercise/exercise-task.interface';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { RemoveTaskCommand } from '@shared/commands/remove-task-command';

@Component({
  selector: 'app-exercise-task-item-overview',
  imports: [],
  templateUrl: './exercise-task-item-overview.html',
  styleUrl: './exercise-task-item-overview.scss',
})
export class ExerciseTaskItemOverview {
  commandManager = inject(CommandManager);
  exerciseManager = inject(ExerciseDocumentManager);
  taskId = input.required<string>();

  remove() {
    const command = new RemoveTaskCommand(this.exerciseManager, this.taskId());
    this.commandManager.execute(command);
  }
}
