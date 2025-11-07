import { Component } from '@angular/core';
import {
  ExerciseExport,
  ExerciseImport,
  ExerciseOverview,
  ExercisePreview,
  ExerciseToolbar,
  SwitchMode,
} from '@features/exercise-editor/components';
import { ExerciseShortcuts } from '@features/exercise-editor/directives/exercise-shortcuts';

@Component({
  selector: 'app-exercise-editor',
  imports: [
    ExerciseExport,
    ExerciseImport,
    ExerciseOverview,
    ExercisePreview,
    ExerciseToolbar,
    SwitchMode,
  ],
  templateUrl: './exercise-editor.html',
  styleUrl: './exercise-editor.css',
  hostDirectives: [ExerciseShortcuts],
})
export class ExerciseEditor {}
