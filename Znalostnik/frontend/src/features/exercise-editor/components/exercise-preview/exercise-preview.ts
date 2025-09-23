import { Component, inject, signal, effect, WritableSignal, linkedSignal } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { ExerciseTask } from '@shared/interfaces/exercise/exercise-task.interface';
import { UpdateTextCommand } from '@shared/commands/update-text-command';
import { CommandHistory } from '@features/exercise-editor/services/command-history';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { ExerciseTaskItem } from '../exercise-task-item/exercise-task-item';

@Component({
  selector: 'app-exercise-preview',
  imports: [ExerciseTaskItem],
  templateUrl: './exercise-preview.html',
  styleUrl: './exercise-preview.css',
})
export class ExercisePreview {
  protected readonly exerciseTaskEdit = inject(ExerciseTaskEdit).editTask;
}
