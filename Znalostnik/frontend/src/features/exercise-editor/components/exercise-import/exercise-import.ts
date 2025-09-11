import { Component, inject } from '@angular/core';
import { ExerciseDocument } from '../../services/exercise-document';

@Component({
  selector: 'app-exercise-import',
  imports: [],
  templateUrl: './exercise-import.html',
  styleUrl: './exercise-import.css',
})
export class ExerciseImport {
  exerciseDocumentService: ExerciseDocument = inject(ExerciseDocument);

  loadExerciseDocument(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        this.exerciseDocumentService.loadFromJson(reader.result as string);
      } catch (e) {
        console.error(e);
      }
    };

    reader.readAsText(file);
  }
}
