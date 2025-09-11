import { Component, inject } from '@angular/core';
import { ExerciseDocument } from '../../services/exercise-document';

@Component({
  selector: 'app-exercise-export',
  imports: [],
  templateUrl: './exercise-export.html',
  styleUrl: './exercise-export.css',
})
export class ExerciseExport {
  exerciseDocumentService: ExerciseDocument = inject(ExerciseDocument);

  saveExerciseDocument(): void {
    const json = this.exerciseDocumentService.getJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'exercise.json';
    a.click();
  }
}
