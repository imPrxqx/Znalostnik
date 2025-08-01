import { Component } from '@angular/core';
import { CentralEditor } from '../central-editor';
import { DocumentSchemas } from '../block-registry';

@Component({
  selector: 'app-list-exercises',
  imports: [],
  templateUrl: './list-exercises.html',
  styleUrl: './list-exercises.css',
})
export class ListExercises {
  constructor(private centralEditorService: CentralEditor) {}

  get exercises() {
    const exercises = this.centralEditorService.document()['exercises'];

    if (!Array.isArray(exercises)) {
      return [];
    }

    return exercises.map((exerciseBlock) => {
      const id = exerciseBlock.id;
      const schemaName = exerciseBlock.documentSchema;

      return {
        id,
        documentSchema: schemaName,
      };
    });
  }

  openExercise(exerciseId: string) {
    console.log(`Opening exercise with ID: ${exerciseId}`);
    this.centralEditorService.selectExercise(exerciseId);
    this.centralEditorService.setSnapshot();
  }

  removeExercise(exerciseId: string) {
    console.log(`Removing exercise with ID: ${exerciseId}`);
    this.centralEditorService.removeExercise(exerciseId);
    this.centralEditorService.setSnapshot();
  }
}
