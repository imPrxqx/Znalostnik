import { Component, inject } from '@angular/core';
import { ExerciseTaskContainer } from '@features/exercise-renderer/components/exercise-task-container/exercise-task-container';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';

@Component({
  selector: 'app-exercise-preview',
  imports: [ExerciseTaskContainer],
  templateUrl: './exercise-preview.html',
  styleUrl: './exercise-preview.css',
})
export class ExercisePreview {
  protected exerciseDocumentService: ExerciseDocumentManager = inject(ExerciseDocumentManager);
  protected exerciseTaskEdit: ExerciseTaskEdit = inject(ExerciseTaskEdit);
}
