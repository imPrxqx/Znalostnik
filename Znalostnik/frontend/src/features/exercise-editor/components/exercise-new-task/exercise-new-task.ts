import { Component, inject, LOCALE_ID, signal } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise-task-document-schema.interface';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { Locale } from '@shared/types/locale.type';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';

@Component({
  selector: 'app-exercise-new-task',
  imports: [],
  templateUrl: './exercise-new-task.html',
  styleUrl: './exercise-new-task.css',
})
export class ExerciseNewTask {
  private exerciseDocumentService: ExerciseDocumentManager = inject(ExerciseDocumentManager);

  protected documentSchemas: ExerciseTaskDocumentSchema[] = ExerciseTaskDocumentSchemas;
  protected locale: keyof Locale = inject(LOCALE_ID) as keyof Locale;

  protected isOpenedTaskMenu = signal<boolean>(false);

  protected toggleMenu() {
    this.isOpenedTaskMenu.set(!this.isOpenedTaskMenu());
  }

  protected addNewTask(taskSchema: ExerciseTaskDocumentSchemaKey) {
    this.exerciseDocumentService.addNewTask(taskSchema);

    this.isOpenedTaskMenu.set(false);
  }
}
