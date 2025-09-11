import { Directive, HostListener, inject } from '@angular/core';
import { ExerciseHistory } from '@features/exercise-editor/services/exercise-history';

@Directive({
  selector: '[appExerciseShortcuts]',
})
export class ExerciseShortcuts {
  exerciseHistoryService: ExerciseHistory = inject(ExerciseHistory);

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      this.exerciseHistoryService.undo();
    } else if (event.ctrlKey && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      this.exerciseHistoryService.redo();
    }
  }
}
