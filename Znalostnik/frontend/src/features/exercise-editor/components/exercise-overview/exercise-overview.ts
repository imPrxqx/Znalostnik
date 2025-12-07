import { Component } from '@angular/core';
import { ExerciseNewTask } from '../exercise-new-task/exercise-new-task';
import { ExerciseTaskList } from '../exercise-task-list/exercise-task-list';

@Component({
  selector: 'app-exercise-overview',
  imports: [ExerciseNewTask, ExerciseTaskList],
  templateUrl: './exercise-overview.html',
  styleUrl: './exercise-overview.scss',
})
export class ExerciseOverview {}
