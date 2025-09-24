import { Component, inject, LOCALE_ID, signal } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise/exercise-task.interface';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { CreateTaskCommand } from '@shared/commands/create-task-command';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { SelectTaskCommand } from '@shared/commands/select-task-command';

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
    const commandCreateTask = new CreateTaskCommand(this.exerciseDocumentService, taskSchema);
    this.commandManager.execute(commandCreateTask);

    const commandSelectTask = new SelectTaskCommand(
      this.exerciseTaskService,
      commandCreateTask.result,
    );
    this.commandManager.execute(commandSelectTask);

    this.isOpenedTaskMenu.set(false);
  }
}
