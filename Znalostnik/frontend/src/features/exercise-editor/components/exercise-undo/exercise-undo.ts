import { Component, inject } from '@angular/core';
import { CommandManager } from '@features/exercise-editor/services/command-manager';

@Component({
  selector: 'app-exercise-undo',
  imports: [],
  templateUrl: './exercise-undo.html',
  styleUrl: './exercise-undo.css',
})
export class ExerciseUndo {
  commandManager = inject(CommandManager);

  protected undo() {
    this.commandManager.undo();
  }
}
