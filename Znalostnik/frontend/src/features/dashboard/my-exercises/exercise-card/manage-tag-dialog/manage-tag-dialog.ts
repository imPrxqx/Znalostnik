import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { TagsApi } from '@features/dashboard/services/tags-api';
import { Tag } from '@shared/models/tag';

export interface ManageTagDataDialog {
  exerciseId: string;
}

@Component({
  selector: 'app-manage-tag-dialog',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatLabel,
    MatInputModule,
    MatDialogActions,
    MatDividerModule,
    MatStepperModule,
    MatChipsModule,
  ],
  templateUrl: './manage-tag-dialog.html',
  styleUrl: './manage-tag-dialog.scss',
})
export class ManageTagDialog {
  private dialogRef = inject(MatDialogRef<ManageTagDialog>);
  private data = inject<ManageTagDataDialog>(MAT_DIALOG_DATA);
  exerciseId = this.data.exerciseId;
  tagsApi = inject(TagsApi);
  tags = signal<Tag[]>([]);
  exerciseTags = signal<Tag[]>([]);
  newTagName = '';

  constructor() {
    this.getTags();
    this.getTagsFromExercise();
  }

  getTags() {
    this.tagsApi.loadTags().subscribe((res) => {
      this.tags.set(res as Tag[]);
    });
  }

  getTagsFromExercise() {
    this.tagsApi.loadExerciseTags(this.exerciseId).subscribe((res) => {
      this.exerciseTags.set(res as Tag[]);
    });
  }

  createTag() {
    const name = this.newTagName.trim();

    if (!name) {
      return;
    }

    this.tagsApi.createTag(name).subscribe(() => {
      this.newTagName = '';
      this.getTags();
    });
  }

  deleteTag(tagId: string) {
    this.tagsApi.deleteTag(tagId).subscribe(() => {
      this.getTags();
      this.getTagsFromExercise();
    });
  }

  addExerciseTag(tagId: string) {
    this.tagsApi
      .addTagToExercise(this.exerciseId, tagId)
      .subscribe(() => this.getTagsFromExercise());
  }

  removeExerciseTag(tagId: string) {
    this.tagsApi
      .removeTagFromExercise(this.exerciseId, tagId)
      .subscribe(() => this.getTagsFromExercise());
  }

  isAssigned(tagId: string): boolean {
    return this.exerciseTags().some((t) => t.id === tagId);
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
