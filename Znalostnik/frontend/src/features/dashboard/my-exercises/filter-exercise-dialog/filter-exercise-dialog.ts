import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { TagsApi } from '@features/dashboard/services/tags-api';

export interface ExerciseFilter {
  search: string;
  tagIds: string[];
  sortBy: 'newest' | 'oldest' | 'title';
}

@Component({
  selector: 'app-filter-exercise-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatIconModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatChipsModule,
    MatDividerModule,
    MatRadioModule,
  ],
  templateUrl: './filter-exercise-dialog.html',
  styleUrl: './filter-exercise-dialog.scss',
})
export class FilterExerciseDialog {
  private dialogRef = inject(MatDialogRef<FilterExerciseDialog>);
  private data = inject<ExerciseFilter>(MAT_DIALOG_DATA);
  tagsApi = inject(TagsApi);
  filter = signal<ExerciseFilter>({
    search: this.data.search ?? '',
    tagIds: [...(this.data.tagIds ?? [])],
    sortBy: this.data.sortBy ?? 'newest',
  });

  tags = signal<any[]>([]);

  constructor() {
    this.getTags();
  }

  getTags() {
    this.tagsApi.loadTags().subscribe((result) => {
      this.tags.set(result as any[]);
    });
  }

  isTagSelected(tagId: string): boolean {
    return this.filter().tagIds.includes(tagId);
  }

  toggleTag(tagId: string): void {
    this.filter.update((filter) => ({
      ...filter,
      tagIds: filter.tagIds.includes(tagId)
        ? filter.tagIds.filter((id) => id !== tagId)
        : [...filter.tagIds, tagId],
    }));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
