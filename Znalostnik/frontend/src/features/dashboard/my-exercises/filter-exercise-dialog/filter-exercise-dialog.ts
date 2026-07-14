import { Component, inject, signal } from '@angular/core';
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
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { TagsApi } from '@features/dashboard/services/tags-api';
import { Tag } from '@shared/models/tag';

export interface ExerciseFilter {
  search: string;
  tagIds: string[];
  sortBy: 'newest' | 'oldest' | 'title';
}

/**
 * Provides dialog for creating filter rules for filtering exercises
 */
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
    search: this.data?.search ?? '',
    tagIds: [...(this.data.tagIds ?? [])],
    sortBy: this.data.sortBy ?? 'newest',
  });

  tags = signal<Tag[]>([]);

  constructor() {
    this.getTags();
  }

  /**
   * Loads all available tags for filtering
   */
  getTags() {
    this.tagsApi.loadTags().subscribe((result) => {
      this.tags.set(result as Tag[]);
    });
  }

  isTagSelected(tagId: string): boolean {
    console.log(this.filter());
    console.log(this.tags());
    return this.filter().tagIds.includes(tagId);
  }

  onTagsChange(event: MatChipListboxChange) {
    console.log(event);
    this.filter.update((f) => ({
      ...f,
      tagIds: event.value,
    }));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
