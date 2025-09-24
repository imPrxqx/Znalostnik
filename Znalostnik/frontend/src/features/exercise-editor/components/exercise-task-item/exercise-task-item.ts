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

@Component({
  selector: 'app-exercise-task-item',
  imports: [],
  templateUrl: './exercise-task-item.html',
  styleUrl: './exercise-task-item.css',
})
export class ExerciseTaskItem {
  readonly task = input.required<WritableSignal<ExerciseTask> | undefined>();
  readonly commandManager = inject(CommandManager);
  readonly toolbarManager = inject(ToolbarManager);

  @ViewChild('taskContainer', { read: ViewContainerRef, static: true })
  taskContainer!: ViewContainerRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && changes['task'].currentValue()) {
      this.renderBlocks();
    }
  }

  renderBlocks(): void {
    this.toolbarManager.clear();
    this.taskContainer.clear();

    if (this.task() === undefined) {
      return;
    }

    const task = this.task()!();

    if (task === undefined) {
      return;
    }

    const taskSchema = task.exerciseTaskDocumentSchema;
    const blocks = task.exerciseTaskBlocks;

    const renderOrder = ExerciseTaskDocumentSchemas.find((s) => s.key === taskSchema)!.renderOrder;

    for (const order of renderOrder) {
      const block = blocks.find((b) => b().taskBlockSchema === order);

      if (!block) {
        console.warn(`Block of type ${order} not found in exercise`);
        continue;
      }

      console.log('Rendering block:', block());

      const componentType = ExerciseTaskBlockComponents[block().taskBlockTemplate];

      if (!componentType) {
        console.warn(`Unknown block type: ${block().taskBlockTemplate}`);
        continue;
      }

      const componentRef = this.taskContainer.createComponent(componentType);
      componentRef.setInput('block', block);
      componentRef.setInput('metadata', block().metadata);
      //componentRef.setInput('editable', this.editable);
      componentRef.setInput('exerciseId', task.id);

      componentRef.instance.commandCreated.subscribe((cmd) => {
        this.commandManager.execute(cmd);
      });

      componentRef.instance.commandList.subscribe((cmd) => {
        this.toolbarManager.setCommands(cmd);
      });

      //   if ('changed' in componentRef.instance && componentRef.instance.changed?.subscribe) {
      //     componentRef.instance.changed.subscribe(() => {
      //       this.dataChanged.emit();
      //     });
      //   }

      //   if ('answer' in componentRef.instance && componentRef.instance.answer?.subscribe) {
      //     componentRef.instance.answer.subscribe((data: any) => {
      //       console.log('Answer', data);
      //       this.answer.emit(data);
      //     });
      //   }

      //   if ('answered' in componentRef.instance) {
      //     componentRef.setInput('answered', this.answered);
      //   }
      // }
    }
  }
}
