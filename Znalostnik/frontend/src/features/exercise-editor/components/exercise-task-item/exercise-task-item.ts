import { Component } from '@angular/core';
import { input } from '@angular/core';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';

@Component({
  selector: 'app-exercise-task-item',
  imports: [],
  templateUrl: './exercise-task-item.html',
  styleUrl: './exercise-task-item.css',
})
export class ExerciseTaskItem {
  task = input.required<ExerciseTask>();
}
