import { Component, computed, inject } from '@angular/core';
import { ExerciseTask } from '@features/exercise-editor/components/exercise-task/exercise-task';
import { SessionState } from '../services/session-state';
import { Task } from '@shared/models/format';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-participant',
  imports: [
    ExerciseTask,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatMenuModule,
  ],
  templateUrl: './participant.html',
  styleUrl: './participant.scss',
})
export class Participant {}
