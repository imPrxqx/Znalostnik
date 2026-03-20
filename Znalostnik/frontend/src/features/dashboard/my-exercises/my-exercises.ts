import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ExerciseCard } from './exercise-card/exercise-card';
import { ExercisesManager } from '../services/exercises-manager';

@Component({
  selector: 'app-my-exercises',
  imports: [MatIconModule, MatMenuModule, MatCardModule, ExerciseCard],
  templateUrl: './my-exercises.html',
  styleUrl: './my-exercises.scss',
})
export class MyExercises {
  manager = inject(ExercisesManager);
  exercises = computed(() => this.manager.exercises());

  ngAfterViewInit() {
    this.manager.loadMyExercises();
  }

  createExercise() {
    this.manager.createExercise();
  }
}
