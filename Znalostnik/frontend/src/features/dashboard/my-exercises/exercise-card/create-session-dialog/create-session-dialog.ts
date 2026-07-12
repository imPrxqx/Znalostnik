import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { GameSetting } from '@shared/models/session';
import { RegistrySession } from '@shared/models/registry-session';

export interface CreateSessionDataDialog {
  exerciseId: string;
}

@Component({
  selector: 'app-create-session-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogActions,
    MatStepperModule,
  ],
  templateUrl: './create-session-dialog.html',
  styleUrl: './create-session-dialog.scss',
})
export class CreateSessionDialog {
  readonly dialogRef = inject(MatDialogRef<CreateSessionDialog>);
  readonly data = inject<CreateSessionDataDialog>(MAT_DIALOG_DATA);
  exerciseId = this.data.exerciseId;
  respondTypes = RegistrySession.respondTypes;
  gameModes = RegistrySession.gameModes;
  gameParameters = RegistrySession.gameParameters;

  form = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    respondType: new FormControl('individual', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    gameMode: new FormControl('classic', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    gameSetting: new FormGroup({
      roundTime: new FormControl(30, { nonNullable: true, validators: [Validators.required] }),
      scoringMode: new FormControl('fast', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      selectionAlgorithm: new FormControl('random', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    }),
  });

  visibleSettings() {
    const mode = this.gameModes.find((m) => m.key === this.form.controls.gameMode.value);

    if (!mode) {
      return [];
    }

    return this.gameParameters.filter((p) => mode.availableGameSettingsKeys.includes(p.key));
  }

  getGameControl(key: keyof GameSetting): FormControl {
    return this.form.controls.gameSetting.controls[key];
  }

  submit() {
    this.dialogRef.close({
      exerciseId: this.data.exerciseId,
      ...this.form.getRawValue(),
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
