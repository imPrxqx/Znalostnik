import {
  Component,
  input,
  WritableSignal,
  ViewChild,
  ViewContainerRef,
  effect,
} from '@angular/core';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseTaskBlockComponents } from '@shared/models/exercise-task-block-components.model';

@Component({
  selector: 'app-exercise-task-item',
  imports: [],
  templateUrl: './exercise-task-item.html',
  styleUrl: './exercise-task-item.css',
})
export class ExerciseTaskItem {
  task = input<WritableSignal<ExerciseTask>>();

  @ViewChild('taskContainer', { read: ViewContainerRef, static: true })
  taskContainer!: ViewContainerRef;

  constructor() {
    effect(() => {
      const taskValue = this.task();

      this.renderBlocks();
      console.log('changed task');
    });
  }

  renderBlocks(): void {
    this.taskContainer.clear();

    if (!this.task()) {
      return;
    }

    const task = this.task()!();

    const taskSchema = task.exerciseTaskDocumentSchema;
    const blocks = task.exerciseTaskBlocks;

    const renderOrder = ExerciseTaskDocumentSchemas.find((s) => s.key === taskSchema)!.renderOrder;

    for (const order of renderOrder) {
      const block = blocks.find((b) => b.taskBlockSchema === order);

      if (!block) {
        console.warn(`Block of type ${order} not found in exercise`);
        continue;
      }

      console.log('Rendering block:', block);

      const componentType = ExerciseTaskBlockComponents[block.taskBlockTemplate];

      if (!componentType) {
        console.warn(`Unknown block type: ${block}`);
        continue;
      }

      const componentRef = this.taskContainer.createComponent(componentType);

      console.log('METADATA', block.metadata);
      componentRef.setInput('metadata', block.metadata);
      //componentRef.setInput('editable', this.editable);
      componentRef.setInput('exerciseId', task.id);

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
