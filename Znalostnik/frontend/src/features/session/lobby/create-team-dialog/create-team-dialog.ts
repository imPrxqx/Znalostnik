import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-team-dialog',
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './create-team-dialog.html',
  styleUrl: './create-team-dialog.scss',
})
export class CreateTeamDialog {
  readonly dialogRef = inject(MatDialogRef<CreateTeamDialog>);
  name = model<string>('');

  onNoClick(): void {
    this.dialogRef.close();
  }
}
