import { Component, inject } from '@angular/core';
import { ExerciseDocumentHistoryManager } from '@features/exercise-editor/services/exercise-document-history-manager';

@Component({
  selector: 'app-exercise-redo',
  imports: [],
  templateUrl: './exercise-redo.html',
  styleUrl: './exercise-redo.css',
})
export class ExerciseRedo {
  protected exerciseDocumentHistoryService: ExerciseDocumentHistoryManager = inject(
    ExerciseDocumentHistoryManager,
  );

  protected redo() {
    this.exerciseDocumentHistoryService.redo();
  }
}
