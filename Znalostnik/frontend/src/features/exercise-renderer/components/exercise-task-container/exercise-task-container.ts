import { Component, input, WritableSignal, signal } from '@angular/core';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';

import { ExerciseTaskItem } from '../exercise-task-item/exercise-task-item';

@Component({
  selector: 'app-exercise-task-container',
  imports: [ExerciseTaskItem],
  templateUrl: './exercise-task-container.html',
  styleUrl: './exercise-task-container.css',
})
export class ExerciseTaskContainer {
  exerciseDocument = input<WritableSignal<ExerciseTask> | undefined>();
  itemsPerPage = input<number>(1);
}
