import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseActivity } from '../exercise-activity/exercise-activity';
import { Activity } from '@shared/models/activity';

@Component({
  selector: 'app-slide',
  imports: [ExerciseActivity, MatIconModule],
  templateUrl: './slide.html',
  styleUrl: './slide.scss',
})
export class Slide {
  activity = input.required<Activity>();
}
