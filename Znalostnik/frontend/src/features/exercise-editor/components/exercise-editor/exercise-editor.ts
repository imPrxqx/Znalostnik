import { Component, inject, OnInit } from '@angular/core';
import { ExerciseShortcuts } from '@features/exercise-editor/directives/exercise-shortcuts';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { Slide } from '../slide/slide';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { CommandManager } from '@features/exercise-editor/services/command-manager';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MoveCommand } from '@shared/commands/move-command';
import { RedoCommand } from '@shared/commands/redo-command';
import { UndoCommand } from '@shared/commands/undo-command';
import { CreateSelectActivityCommand } from '@shared/commands/create-select-activity-command';
import { ExerciseActivityEdit } from '@features/exercise-editor/services/exercise-activity-edit';
import { ExerciseActivity } from '../exercise-activity/exercise-activity';
import { RemoveActivityCommand } from '@shared/commands/remove-activity-command';
import { LoadCommand } from '@shared/commands/load-command';
import { ExercisesManager } from '@features/dashboard/services/exercises-manager';
import { SaveCommand } from '@shared/commands/save-command';
import { ExportJsonVisitor } from '@shared/models/json-export';
import { Activity } from '@shared/models/activity';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateActivityDialog } from '../create-activity-dialog/create-activity-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseToolbar } from '../exercise-toolbar/exercise-toolbar';
import { UpdateActivityStyleCommand } from '@shared/commands/update-activity-style-command';
import { ExerciseConfiguration } from '@shared/models/exercise';

@Component({
  selector: 'app-exercise-editor',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    Slide,
    CommonModule,
    DragDropModule,
    ExerciseActivity,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ExerciseToolbar,
  ],
  templateUrl: './exercise-editor.html',
  styleUrl: './exercise-editor.scss',
  hostDirectives: [ExerciseShortcuts],
})
export class ExerciseEditor implements OnInit {
  document = inject(ExerciseDocumentManager);
  edit = inject(ExerciseActivityEdit);
  commandManager = inject(CommandManager);
  exercisesManager = inject(ExercisesManager);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);

  ngOnInit() {
    const exerciseId = this.route.snapshot.paramMap.get('id');

    if (!exerciseId) {
      this.router.navigate([`/dashboard`]);
      return;
    }

    this.document.exerciseId.set(exerciseId);
    this.exercisesManager.editExercise(exerciseId);
  }

  import(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      this.load(json);
    };

    reader.readAsText(file);
  }

  export() {
    const visitor = new ExportJsonVisitor();
    visitor.visitExercise(this.document.exercise());

    const json = visitor.toJson();

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.document.exercise().title() + '.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  load(json: ExerciseConfiguration) {
    const command = new LoadCommand(this.document, json);
    this.commandManager.execute(command);
  }

  save() {
    const command = new SaveCommand(
      this.document,
      this.exercisesManager,
      this.document.exerciseId(),
    );
    this.commandManager.execute(command);
  }

  undo() {
    const command = new UndoCommand(this.commandManager);
    this.commandManager.execute(command);
  }

  redo() {
    const command = new RedoCommand(this.commandManager);
    this.commandManager.execute(command);
  }

  remove(activityId: string) {
    const command = new RemoveActivityCommand(this.document, activityId);
    this.commandManager.execute(command);
  }

  drop(event: CdkDragDrop<Activity[]>) {
    const command = new MoveCommand(this.document, event.previousIndex, event.currentIndex);
    this.commandManager.execute(command);
  }

  addNewActivity(schema: string) {
    const command = new CreateSelectActivityCommand(this.document, this.edit, schema);
    this.commandManager.execute(command);
  }

  setBorderRadius(radius: number) {
    if (this.edit.activity() === undefined) {
      return;
    }

    const newStyle = structuredClone(this.edit.activity()!.style());
    newStyle.borderRadius = radius;
    const command = new UpdateActivityStyleCommand(this.edit.activity()!, newStyle);
    this.commandManager.execute(command);
  }

  setBorderColor(color: string) {
    if (this.edit.activity() === undefined) {
      return;
    }

    const newStyle = structuredClone(this.edit.activity()!.style());
    newStyle.borderColor = color;
    const command = new UpdateActivityStyleCommand(this.edit.activity()!, newStyle);
    this.commandManager.execute(command);
  }

  setBackgroundColor(color: string) {
    if (this.edit.activity() === undefined) {
      return;
    }

    const newStyle = structuredClone(this.edit.activity()!.style());
    newStyle.backgroundColor = color;
    const command = new UpdateActivityStyleCommand(this.edit.activity()!, newStyle);
    this.commandManager.execute(command);
  }

  openActivityDialog() {
    const dialogRef = this.dialog.open(CreateActivityDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addNewActivity(result);
      }
    });
  }
}
