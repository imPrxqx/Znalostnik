import { Component, inject, LOCALE_ID } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise-task-document-schema.interface';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { Locale } from '@shared/types/locale.type';
import { ExerciseRedo } from '../exercise-redo/exercise-redo';
import { ExerciseUndo } from '../exercise-undo/exercise-undo';

@Component({
  selector: 'app-exercise-toolbar',
  imports: [ExerciseRedo, ExerciseUndo],
  templateUrl: './exercise-toolbar.html',
  styleUrl: './exercise-toolbar.css',
})
export class ExerciseToolbar {
  private exerciseDocumentService: ExerciseDocumentManager = inject(ExerciseDocumentManager);

  protected documentSchemas: ExerciseTaskDocumentSchema[] = ExerciseTaskDocumentSchemas;
  protected locale: keyof Locale = inject(LOCALE_ID) as keyof Locale;
}
