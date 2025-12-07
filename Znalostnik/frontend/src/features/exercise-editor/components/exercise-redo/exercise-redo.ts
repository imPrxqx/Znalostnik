import { Component, inject } from '@angular/core';
import { CommandManager } from '@features/exercise-editor/services/command-manager';

@Component({
  selector: 'app-exercise-redo',
  imports: [],
  templateUrl: './exercise-redo.html',
  styleUrl: './exercise-redo.scss',
})
export class ExerciseRedo {
  commandManager = inject(CommandManager);

  protected redo() {
    this.commandManager.redo();
  }
}
