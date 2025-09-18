import { Directive, HostListener, inject } from '@angular/core';
import { ExerciseDocumentHistoryManager } from '../services/exercise-document-history-manager';
import { ExerciseDocumentManager } from '../services/exercise-document-manager';
import { ExerciseSnapshot } from '../interfaces/exercise-snapshot.interface';

@Directive({
  selector: '[appExerciseShortcuts]',
})
export class ExerciseShortcuts {
  exerciseHistoryService: ExerciseDocumentHistoryManager = inject(ExerciseDocumentHistoryManager);
  exerciseDocumentService: ExerciseDocumentManager = inject(ExerciseDocumentManager);

  @HostListener('window:keydown.control.z', ['$event'])
  onUndo(event: Event) {
    event.preventDefault();
    const snapshot: ExerciseSnapshot | undefined = this.exerciseHistoryService.undo();
    if (snapshot) {
      this.exerciseDocumentService.setExerciseDocument(snapshot.exerciseDocument, true);
      //this.exerciseDocumentService.setSelectedTaskById(snapshot.selectedTaskId, true);
    }
  }

  @HostListener('window:keydown.control.y', ['$event'])
  onRedo(event: Event) {
    event.preventDefault();
    const snapshot: ExerciseSnapshot | undefined = this.exerciseHistoryService.redo();

    if (snapshot) {
      this.exerciseDocumentService.setExerciseDocument(snapshot.exerciseDocument, true);
      //this.exerciseDocumentService.setSelectedTaskById(snapshot.selectedTaskId, true);
    }
  }
}
