import { Component, inject, signal, effect, WritableSignal, linkedSignal } from '@angular/core';
import { ExerciseTaskContainer } from '@features/exercise-renderer/components/exercise-task-container/exercise-task-container';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';
import { UpdateTextCommand } from '@shared/commands/update-text-command';
import { CommandHistory } from '@features/exercise-editor/services/command-history';
import { CommandManager } from '@features/exercise-editor/services/command-manager';

@Component({
  selector: 'app-exercise-preview',
  imports: [ExerciseTaskContainer],
  templateUrl: './exercise-preview.html',
  styleUrl: './exercise-preview.css',
})
export class ExercisePreview {
  //protected exerciseTaskEdit: ExerciseTaskEdit = inject(ExerciseTaskEdit);
  protected readonly exerciseTaskEdit: WritableSignal<WritableSignal<ExerciseTask>> = inject(
    ExerciseTaskEdit,
  ).editTask as WritableSignal<WritableSignal<ExerciseTask>>;
  protected commandManager = inject(CommandManager);

  constructor() {
    // const c: Command = new UpdateTextCommand();
    // c.execute();
  }
}
