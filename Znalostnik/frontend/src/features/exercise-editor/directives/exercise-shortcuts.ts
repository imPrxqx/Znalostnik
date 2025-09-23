import { Directive, HostListener, inject } from '@angular/core';
import { CommandManager } from '../services/command-manager';

@Directive({
  selector: '[appExerciseShortcuts]',
})
export class ExerciseShortcuts {
  commandManager = inject(CommandManager);

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
