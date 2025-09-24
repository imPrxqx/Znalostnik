import { Component, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise/exercise-task.interface';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseRedo } from '../exercise-redo/exercise-redo';
import { ExerciseUndo } from '../exercise-undo/exercise-undo';
import { ToolbarManager } from '@features/exercise-editor/services/toolbar-manager';
import { CommandManager } from '@features/exercise-editor/services/command-manager';

@Component({
  selector: 'app-exercise-toolbar',
  imports: [ExerciseRedo, ExerciseUndo],
  templateUrl: './exercise-toolbar.html',
  styleUrl: './exercise-toolbar.css',
})
export class ExerciseToolbar {
  toolbarManager = inject(ToolbarManager);
  commandManager = inject(CommandManager);

  @ViewChild('commandContainer', { read: ViewContainerRef, static: true })
  commandContainer!: ViewContainerRef;

  constructor() {
    effect(() => {
      const taskValue = this.toolbarManager.commands();
      console.log('changed commands', this.toolbarManager.commands());

      this.renderCommands();
    });
  }

  renderCommands(): void {
    this.commandContainer.clear();

    for (const command of this.toolbarManager.commands()) {
      console.log('Rendering command:', command);

      const componentType = command.component;

      if (!componentType) {
        console.warn(`Unknown command type: ${command}`);
        continue;
      }

      const componentRef = this.commandContainer.createComponent(componentType);

      componentRef.setInput('receiver', command.receiver);

      componentRef.instance.commandCreated.subscribe((cmd) => {
        console.log('applying cmd', cmd);
        this.commandManager.execute(cmd);
      });
    }
  }

  clear(): void {
    this.toolbarManager.clear();
  }
}
