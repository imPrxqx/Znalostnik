import { Directive, HostListener, inject } from '@angular/core';
import { ExerciseHistory } from '@features/exercise-editor/services/exercise-history';
import { ExerciseDocument } from '../services/exercise-document';
import { IExerciseSnapshot } from '../interfaces/exercise-snapshot.interface';

@Directive({
  selector: '[appExerciseShortcuts]',
})
export class ExerciseShortcuts {
  exerciseHistoryService: ExerciseHistory = inject(ExerciseHistory);
  exerciseDocumentService: ExerciseDocument = inject(ExerciseDocument);

  @HostListener('window:keydown.control.z', ['$event'])
  onUndo(event: Event) {
    event.preventDefault();
    const snapshot: IExerciseSnapshot | undefined = this.exerciseHistoryService.undo();
    if (snapshot) {
      this.exerciseDocumentService.setExerciseDocument(snapshot.exerciseDocument, true);
      this.exerciseDocumentService.setSelectedTaskById(snapshot.selectedTaskId, true);
    }
  }

  @HostListener('window:keydown.control.y', ['$event'])
  onRedo(event: Event) {
    event.preventDefault();
    const snapshot: IExerciseSnapshot | undefined = this.exerciseHistoryService.redo();

    if (snapshot) {
      this.exerciseDocumentService.setExerciseDocument(snapshot.exerciseDocument, true);
      this.exerciseDocumentService.setSelectedTaskById(snapshot.selectedTaskId, true);
    }
  }
}
