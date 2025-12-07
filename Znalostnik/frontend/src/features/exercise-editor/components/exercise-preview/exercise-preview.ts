import { Component, inject, signal } from '@angular/core';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { ExerciseTaskItem } from '../exercise-task-item/exercise-task-item';

@Component({
  selector: 'app-exercise-preview',
  imports: [ExerciseTaskItem],
  templateUrl: './exercise-preview.html',
  styleUrl: './exercise-preview.scss',
})
export class ExercisePreview {
  protected readonly viewMode = signal<'edit' | 'view'>('edit');
  protected readonly exerciseTaskEdit = inject(ExerciseTaskEdit).task;
}
