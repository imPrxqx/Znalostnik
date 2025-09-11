import { Component } from '@angular/core';
import {
  ExerciseEdit,
  ExerciseExport,
  ExerciseImport,
  ExerciseOverview,
  ExercisePreview,
  ExerciseToolbar,
} from '@features/exercise-editor/components';
import { ExerciseShortcuts } from '@features/exercise-editor/directives/exercise-shortcuts';

@Component({
  selector: 'app-exercise-editor',
  imports: [
    ExerciseEdit,
    ExerciseExport,
    ExerciseImport,
    ExerciseOverview,
    ExercisePreview,
    ExerciseToolbar,
  ],
  templateUrl: './exercise-editor.html',
  styleUrl: './exercise-editor.css',
  hostDirectives: [ExerciseShortcuts],
})
export class ExerciseEditor {}
