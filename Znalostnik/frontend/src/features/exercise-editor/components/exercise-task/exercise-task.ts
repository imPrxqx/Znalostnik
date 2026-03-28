import { Component, inject, input, model, ViewContainerRef } from '@angular/core';
import { Registry, Task, TaskAnswer } from '@shared/models/format';

@Component({
  selector: 'app-exercise-task',
  imports: [],
  templateUrl: './exercise-task.html',
  styleUrl: './exercise-task.scss',
})
export class ExerciseTask {
  viewContainer = inject(ViewContainerRef);
  task = input.required<Task>();
  answer = model<TaskAnswer | undefined>();

  ngOnChanges() {
    this.renderTask();
  }

  renderTask() {
    this.viewContainer.clear();
    const compRef = this.viewContainer.createComponent(Registry.components[this.task().type()]);
    compRef.setInput('model', this.task());
    compRef.setInput('answer', this.answer());
  }
}
