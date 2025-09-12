import { Directive, HostListener, inject } from '@angular/core';
import { ExerciseHistory } from '@features/exercise-editor/services/exercise-history';
import { ExerciseDocument } from '../services/exercise-document';
import { ExerciseSnapshotModel } from '../models/exercise-snapshot';

@Directive({
  selector: '[appExerciseShortcuts]',
})
export class ExerciseShortcuts {
  exerciseHistoryService: ExerciseHistory = inject(ExerciseHistory);
  exerciseDocumentService: ExerciseDocument = inject(ExerciseDocument);

  @HostListener('window:keydown.control.z', ['$event'])
  onUndo(event: Event) {
    event.preventDefault();
    const snapshot: ExerciseSnapshotModel | undefined = this.exerciseHistoryService.undo();
    if (snapshot) {
      this.exerciseDocumentService.setExerciseDocument(snapshot.exerciseDocument, true);
      this.exerciseDocumentService.setSelectedTasksByIds(snapshot.selectedTaskIds, true);
    }
  }

  @HostListener('window:keydown.control.y', ['$event'])
  onRedo(event: Event) {
    event.preventDefault();
    const snapshot: ExerciseSnapshotModel | undefined = this.exerciseHistoryService.redo();

    if (snapshot) {
      this.exerciseDocumentService.setExerciseDocument(snapshot.exerciseDocument, true);
      this.exerciseDocumentService.setSelectedTasksByIds(snapshot.selectedTaskIds, true);
    }
  }
}
