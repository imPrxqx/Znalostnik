import { Directive, HostListener, inject } from '@angular/core';
import { ExerciseDocumentManager } from '../services/exercise-document-manager';
import { ExerciseSnapshot } from '../interfaces/exercise-snapshot.interface';
import { CommandHistory } from '../services/command-history';
import { CommandManager } from '../services/command-manager';

@Directive({
  selector: '[appExerciseShortcuts]',
})
export class ExerciseShortcuts {
  commandManager = inject(CommandManager);
  exerciseDocumentService: ExerciseDocumentManager = inject(ExerciseDocumentManager);

  @HostListener('window:keydown.control.z', ['$event'])
  onUndo(event: Event) {
    event.preventDefault();
    this.commandManager.undo();
  }

  @HostListener('window:keydown.control.y', ['$event'])
  onRedo(event: Event) {
    event.preventDefault();
    this.commandManager.redo();
  }
}
