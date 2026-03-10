import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseTask } from '../exercise-task/exercise-task';

@Component({
  selector: 'app-slide',
  imports: [ExerciseTask, MatIconModule],
  templateUrl: './slide.html',
  styleUrl: './slide.scss',
})
export class Slide {
  task = input.required<any>();
}
