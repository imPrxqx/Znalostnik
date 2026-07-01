import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Team } from '@shared/models/dtos';

export interface JoinTeamDialogData {
  teams: Team[];
}

@Component({
  selector: 'app-join-team-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './join-team-dialog.html',
  styleUrl: './join-team-dialog.scss',
})
export class JoinTeamDialog {
  readonly dialogRef = inject(MatDialogRef<JoinTeamDialog>);
  readonly data = inject<JoinTeamDialogData>(MAT_DIALOG_DATA);
  selectedTeamId = signal<string | undefined>(undefined);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
