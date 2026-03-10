import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Exercise } from '../services/exercises';
import { Exercises } from '../services/exercises';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-exercises',
  imports: [MatIconModule, MatMenuModule, MatCardModule],
  templateUrl: './my-exercises.html',
  styleUrl: './my-exercises.scss',
})
export class MyExercises {
  exercises: Exercise[] = [];
  router = inject(Router);

  createExercise() {
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      title: 'New Exercise',
      type: 'Quiz',
      content: '',
    };
    this.exercises.push(newExercise);
  }

  openEditor(id: string) {
    this.router.navigate(['/editor', id]);
  }

  deleteExercise(ex: Exercise) {}
}
