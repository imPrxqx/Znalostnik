import { Component, inject } from '@angular/core';
import { ExerciseDocumentHistoryManager } from '@features/exercise-editor/services/exercise-document-history-manager';

@Component({
  selector: 'app-exercise-undo',
  imports: [],
  templateUrl: './exercise-undo.html',
  styleUrl: './exercise-undo.css',
})
export class ExerciseUndo {
  protected exerciseDocumentHistoryService: ExerciseDocumentHistoryManager = inject(
    ExerciseDocumentHistoryManager,
  );

  protected undo() {
    this.exerciseDocumentHistoryService.undo();
  }
}
