import { Directive, HostListener, inject } from '@angular/core';
import { CommandManager } from '../services/command-manager';
import { RedoCommand } from '@shared/commands/redo-command';
import { UndoCommand } from '@shared/commands/undo-command';

@Directive({
  selector: '[appExerciseShortcuts]',
})
export class ExerciseShortcuts {
  commandManager = inject(CommandManager);

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
}
