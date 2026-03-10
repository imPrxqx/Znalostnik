import { Component, inject, computed } from '@angular/core';
import { ExerciseToolbar } from '@features/exercise-editor/components';
import { ExerciseShortcuts } from '@features/exercise-editor/directives/exercise-shortcuts';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Slide } from '../slide/slide';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '@shared/models/format';
import { MoveCommand } from '@shared/commands/move-command';
import { RedoCommand } from '@shared/commands/redo-command';
import { UndoCommand } from '@shared/commands/undo-command';
import { CreateSelectTaskCommand } from '@shared/commands/create-select-task-command';
import { ExerciseTaskEdit } from '@features/exercise-editor/services/exercise-task-edit';
import { ExerciseTaskDocumentSchemas } from '@shared/models/exercise-task-document-schemas.model';
import { ExerciseTask } from '../exercise-task/exercise-task';
import { RemoveTaskCommand } from '@shared/commands/remove-task-command';

@Component({
  selector: 'app-exercise-editor',
  imports: [
    RouterModule,
    MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    Slide,
    CommonModule,
    DragDropModule,
    ExerciseTask,
    ExerciseToolbar,
  ],
  templateUrl: './exercise-editor.html',
  styleUrl: './exercise-editor.scss',
  hostDirectives: [ExerciseShortcuts],
})
export class ExerciseEditor {
  document = inject(ExerciseDocumentManager);
  edit = inject(ExerciseTaskEdit);
  commandManager = inject(CommandManager);
  documentSchemas = ExerciseTaskDocumentSchemas;

  import() {}

  export() {}

  save() {}

  undo() {
    const command = new UndoCommand(this.commandManager);
    this.commandManager.execute(command);
  }

  redo() {
    const command = new RedoCommand(this.commandManager);
    this.commandManager.execute(command);
  }

  remove(taskId: string) {
    const command = new RemoveTaskCommand(this.document, taskId);
    this.commandManager.execute(command);
  }

  drop(event: CdkDragDrop<Task[]>) {
    const command = new MoveCommand(this.document, event.previousIndex, event.currentIndex);
    this.commandManager.execute(command);
  }

  addNewTask(schema: string) {
    const commandCreateSelectTask = new CreateSelectTaskCommand(this.document, this.edit, schema);
    this.commandManager.execute(commandCreateSelectTask);
  }
}
