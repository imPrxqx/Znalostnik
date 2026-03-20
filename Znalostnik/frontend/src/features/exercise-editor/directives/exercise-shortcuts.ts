import { Directive, HostListener, inject } from '@angular/core';
import { CommandManager } from '../services/command-manager';
import { RedoCommand } from '@shared/commands/redo-command';
import { UndoCommand } from '@shared/commands/undo-command';
import { SaveCommand } from '@shared/commands/save-command';
import { ExerciseDocumentManager } from '../services/exercise-document-manager';
import { ExercisesManager } from '@features/dashboard/services/exercises-manager';

@Directive({
  selector: '[appExerciseShortcuts]',
})
export class ExerciseShortcuts {
  commandManager = inject(CommandManager);
  document = inject(ExerciseDocumentManager);
  exercises = inject(ExercisesManager);

  @HostListener('window:keydown.control.z', ['$event'])
  onUndo(event: Event) {
    event.preventDefault();
    const command = new UndoCommand(this.commandManager);
    this.commandManager.execute(command);
  }

  @HostListener('window:keydown.control.y', ['$event'])
  onRedo(event: Event) {
    event.preventDefault();
    const command = new RedoCommand(this.commandManager);
    this.commandManager.execute(command);
  }

  @HostListener('window:keydown.control.s', ['$event'])
  onSave(event: Event) {
    event.preventDefault();
    const command = new SaveCommand(this.document, this.exercises);
    this.commandManager.execute(command);
  }
}
