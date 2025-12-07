import { Component, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { ExerciseRedo } from '../exercise-redo/exercise-redo';
import { ExerciseUndo } from '../exercise-undo/exercise-undo';
import { ToolbarManager } from '@features/exercise-editor/services/toolbar-manager';
import { CommandManager } from '@features/exercise-editor/services/command-manager';

@Component({
  selector: 'app-exercise-toolbar',
  imports: [ExerciseRedo, ExerciseUndo],
  templateUrl: './exercise-toolbar.html',
  styleUrl: './exercise-toolbar.scss',
})
export class ExerciseToolbar {
  toolbarManager = inject(ToolbarManager);
  commandManager = inject(CommandManager);

  @ViewChild('commandContainer', { read: ViewContainerRef, static: true })
  commandContainer!: ViewContainerRef;

  constructor() {
    effect(() => {
      const taskValue = this.toolbarManager.commands();
      this.renderCommands();
    });
  }

  renderCommands(): void {
    this.commandContainer.clear();

    if (this.toolbarManager.commands() === undefined) {
      return;
    }

    for (const component of this.toolbarManager.commands()!.components) {
      const componentRef = this.commandContainer.createComponent(component);

      componentRef.setInput('format', this.toolbarManager.commands()!.receiver);

      componentRef.instance.commands.subscribe((cmd) => {
        this.commandManager.execute(cmd);
      });
    }
  }

  clear(): void {
    this.toolbarManager.clear();
  }
}
