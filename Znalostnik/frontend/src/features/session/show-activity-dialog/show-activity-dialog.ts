import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseActivity } from '@features/exercise-editor/components/exercise-activity/exercise-activity';

@Component({
  selector: 'app-show-activity-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    ExerciseActivity,
  ],
  templateUrl: './show-activity-dialog.html',
  styleUrl: './show-activity-dialog.scss',
})
export class ShowActivityDialog {
  readonly dialogRef = inject(MatDialogRef<ShowActivityDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  onNoClick() {
    this.dialogRef.close();
  }
}
