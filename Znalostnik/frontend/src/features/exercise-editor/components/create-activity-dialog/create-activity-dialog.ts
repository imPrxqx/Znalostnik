import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Registry } from '@shared/models/registry';

@Component({
  selector: 'app-create-activity-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
  ],
  templateUrl: './create-activity-dialog.html',
  styleUrl: './create-activity-dialog.scss',
})
export class CreateActivityDialog {
  readonly dialogRef = inject(MatDialogRef<CreateActivityDialog>);
  selected = signal<string>(Registry.activities[0].key);
  activities = Registry.activities;

  confirm() {
    this.dialogRef.close(this.selected());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
