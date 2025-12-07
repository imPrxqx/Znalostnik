import {
  Component,
  input,
  WritableSignal,
  ViewChild,
  model,
  ViewContainerRef,
  effect,
  Signal,
  inject,
  SimpleChanges,
} from '@angular/core';
import { ExerciseTask } from '@shared/interfaces/exercise/exercise-task.interface';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseTaskBlockComponents } from '@shared/models/exercise-task-block-components.model';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { ToolbarManager } from '@features/exercise-editor/services/toolbar-manager';
import { Task } from '@shared/models/format';
import { Registry } from '@shared/models/format';
import { ToolbarSupport, ToolbarOutput } from '@shared/models/format';
import { ShowBlockCommands } from '@shared/commands/show-block-commands-command';

@Component({
  selector: 'app-exercise-task-item',
  imports: [],
  templateUrl: './exercise-task-item.html',
  styleUrl: './exercise-task-item.scss',
})
export class ExerciseTaskItem {
  readonly viewMode = input.required<'edit' | 'view'>();
  readonly task = input.required<Task | undefined>();
  readonly commandManager = inject(CommandManager);
  readonly toolbarManager = inject(ToolbarManager);

  @ViewChild('taskContainer', { read: ViewContainerRef, static: true })
  taskContainer!: ViewContainerRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task() !== undefined) {
      this.renderBlocks();
    }
  }

  renderBlocks(): void {
    console.log('REnder');

    this.toolbarManager.clear();
    this.taskContainer.clear();

    if (this.task() === undefined) {
      return;
    }

    const task = this.task();

    if (task === undefined) {
      return;
    }

    const taskSchema = task.type();
    const blocks = task.formats();

    for (const block of blocks) {
      const component = block.component();

      if (!component) {
        continue;
      }

      const componentType = Registry.components.get(component);

      if (componentType === undefined) {
        continue;
      }

      const componentRef = this.taskContainer.createComponent(componentType);
      componentRef.setInput('viewMode', this.viewMode());
      componentRef.setInput('format', block);

      componentRef.instance.actions.subscribe((action) => {
        if (action.type === 'toolbar') {
          if (this.isToolbarSupport(action.payload)) {
            const toolbarCmd = new ShowBlockCommands(this.toolbarManager, action.payload);
            this.commandManager.execute(toolbarCmd);
          }

          return;
        }

        if (action.type === 'central') {
          if (this.isCommand(action.payload)) {
            this.commandManager.execute(action.payload);
          }

          return;
        }
      });
    }
  }

  isToolbarSupport(obj: any): obj is ToolbarSupport<any> {
    return obj && typeof obj.getToolbarCommands === 'function';
  }

  isCommand(obj: any): obj is Command {
    return obj && typeof obj.execute === 'function' && typeof obj.undo === 'function';
  }
}
