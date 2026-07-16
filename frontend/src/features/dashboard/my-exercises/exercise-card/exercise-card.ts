import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ExercisesManager } from '@features/dashboard/services/exercises-manager';
import { Slide } from '@features/exercise-editor/components/slide/slide';
import { MatDialog } from '@angular/material/dialog';
import { Activity } from '@shared/models/activity';
import { ActivityFactory } from '@shared/factories/activity-factory';
import { OnInit } from '@angular/core';
import { CreateSessionDialog } from './create-session-dialog/create-session-dialog';
import { MatDivider } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { ManageTagDialog } from './manage-tag-dialog/manage-tag-dialog';
import { TagsApi } from '@features/dashboard/services/tags-api';
import { SessionsManager } from '@features/dashboard/services/sessions-manager';
import { Exercise } from '@shared/models/exercise';
import { Tag } from '@shared/models/tag';

/**
 * Displays an exercise summary with related activity, tags,
 * and actions such as editing, deleting and creating sessions.
 */
@Component({
  selector: 'app-exercise-card',
  imports: [
    MatCardModule,
    MatDivider,
    MatButtonModule,
    MatIconModule,
    Slide,
    CommonModule,
    MatChipsModule,
  ],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.scss',
})
export class ExerciseCard implements OnInit {
  exercise = input.required<Exercise>();
  activity = signal<Activity | undefined>(undefined);
  exerciseTags = signal<Tag[]>([]);
  exercises = inject(ExercisesManager);
  sessions = inject(SessionsManager);
  router = inject(Router);
  tags = inject(TagsApi);
  dialog = inject(MatDialog);

  ngOnInit() {
    this.exercises.loadFirstActivity(this.exercise().id()).subscribe({
      next: (json) => {
        const activity = ActivityFactory.createFromJson(json);
        this.activity.set(activity);
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.tags.loadExerciseTags(this.exercise().id()).subscribe({
      next: (json) => {
        this.exerciseTags.set(json as Tag[]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  openEditor() {
    this.router.navigate([`/exercise-editor/${this.exercise().id()}`]);
  }

  deleteExercise() {
    this.exercises.deleteExercise(this.exercise().id());
  }

  /**
   * Opens a dialog for creating new session, dialog then returns all selected parameters used for session and creates it
   */
  openCreateSessionDialog() {
    const dialogRef = this.dialog.open(CreateSessionDialog, {
      width: '800px',
      data: {
        exerciseId: this.exercise().id(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.sessions.createSession(
        result.exerciseId,
        result.title,
        result.respondType,
        result.gameMode,
        result.gameSetting,
      );
    });
  }

  /**
   * Opens a dialog for managing exercises tags for selected exercise, dialog then apply new tags to selected exercise
   */
  openTagsDialog() {
    const dialogRef = this.dialog.open(ManageTagDialog, {
      width: '800px',
      data: {
        exerciseId: this.exercise().id(),
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.tags.loadExerciseTags(this.exercise().id()).subscribe({
        next: (json) => {
          this.exerciseTags.set(json as Tag[]);
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }
}
