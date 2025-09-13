import { Component, inject, LOCALE_ID } from '@angular/core';
import { ExerciseDocument } from '../../services/exercise-document';
import { ITaskDocumentSchema } from '@shared/interfaces/exercise-document-schema.interface';
import { TaskDocumentSchemas } from '@shared/models/exercise-document-schema.model';
import { Locale } from '@shared/types/locale.type';

@Component({
  selector: 'app-exercise-toolbar',
  imports: [],
  templateUrl: './exercise-toolbar.html',
  styleUrl: './exercise-toolbar.css',
})
export class ExerciseToolbar {
  private exerciseDocumentService: ExerciseDocument = inject(ExerciseDocument);

  protected documentSchemas: ITaskDocumentSchema[] = TaskDocumentSchemas;
  protected locale: keyof Locale = inject(LOCALE_ID) as keyof Locale;
}
