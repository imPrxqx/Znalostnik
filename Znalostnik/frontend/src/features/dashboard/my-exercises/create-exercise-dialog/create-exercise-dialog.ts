import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/**
 * Provides dialog for creating exercise title
 */
@Component({
  selector: 'app-create-exercise-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
  ],
  templateUrl: './create-exercise-dialog.html',
  styleUrl: './create-exercise-dialog.scss',
})
export class CreateExerciseDialog {
  readonly dialogRef = inject(MatDialogRef<CreateExerciseDialog>);
  name = model<string>('');

  onNoClick(): void {
    this.dialogRef.close();
  }
}
