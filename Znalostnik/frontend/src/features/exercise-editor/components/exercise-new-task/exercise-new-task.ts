import { Component, inject, LOCALE_ID, signal } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise/exercise-task.interface';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-key.type';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { CreateSelectTaskCommand } from '@shared/commands/create-select-task-command';

@Component({
  selector: 'app-exercise-new-task',
  imports: [],
  templateUrl: './exercise-new-task.html',
  styleUrl: './exercise-new-task.css',
})
export class ExerciseNewTask {
  private exerciseDocumentService: ExerciseDocumentManager = inject(ExerciseDocumentManager);
  private exerciseTaskService: ExerciseTaskEdit = inject(ExerciseTaskEdit);
  private commandManager = inject(CommandManager);
  protected documentSchemas: ExerciseTaskDocumentSchema[] = ExerciseTaskDocumentSchemas;
  protected isOpenedTaskMenu = signal<boolean>(false);

  protected toggleMenu() {
    this.isOpenedTaskMenu.set(!this.isOpenedTaskMenu());
  }

  protected addNewTask(taskSchema: ExerciseTaskDocumentSchemaKey) {
    const commandCreateSelectTask = new CreateSelectTaskCommand(
      this.exerciseDocumentService,
      this.exerciseTaskService,
      taskSchema,
    );
    this.commandManager.execute(commandCreateSelectTask);
    this.isOpenedTaskMenu.set(false);
  }
}
