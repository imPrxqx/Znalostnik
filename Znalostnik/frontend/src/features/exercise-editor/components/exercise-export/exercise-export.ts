import { Component, inject } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';

@Component({
  selector: 'app-exercise-export',
  imports: [],
  templateUrl: './exercise-export.html',
  styleUrl: './exercise-export.css',
})
export class ExerciseExport {
  exerciseDocumentService: ExerciseDocumentManager = inject(ExerciseDocumentManager);

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
