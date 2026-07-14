import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseCard } from './exercise-card/exercise-card';
import { ExercisesManager } from '../services/exercises-manager';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { signal, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateExerciseDialog } from './create-exercise-dialog/create-exercise-dialog';
import {
  ExerciseFilter,
  FilterExerciseDialog,
} from './filter-exercise-dialog/filter-exercise-dialog';
import { TagsApi } from '../services/tags-api';

/**
 * Displays users created exercises and provides searching,
 * filtering, sorting and exercise creation functionality.
 */
@Component({
  selector: 'app-my-exercises',
  imports: [
    MatIconModule,
    ExerciseCard,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './my-exercises.html',
  styleUrl: './my-exercises.scss',
})
export class MyExercises implements AfterViewInit {
  manager = inject(ExercisesManager);
  exercises = computed(() => this.manager.exercises());
  tagsApi = inject(TagsApi);

  // Current applied filter rules
  filter = signal<ExerciseFilter>({
    search: '',
    tagIds: [] as string[],
    sortBy: 'newest',
  });
  dialog = inject(MatDialog);

  // Filtered exercises base on filter rules
  filteredExercises = computed(() => {
    const exercises = this.exercises();
    const filter = this.filter();
    const search = filter.search.toLowerCase().trim();

    // Filter all exercise which have same value in searching title and match all selected tags
    let result = exercises.filter((e) => {
      const matchSearch = !search || e.title().toLowerCase().includes(search);
      const matchTags = filter.tagIds.every((tagId) => e.tags().some((tag) => tag.id === tagId));
      return matchSearch && matchTags;
    });

    // Sort filtered exercises based on softing type
    if (filter.sortBy === 'newest') {
      result = result.sort(
        (a, b) => new Date(b.updatedAt()).getTime() - new Date(a.updatedAt()).getTime(),
      );
    }

    if (filter.sortBy === 'oldest') {
      result = result.sort(
        (a, b) => new Date(a.updatedAt()).getTime() - new Date(b.updatedAt()).getTime(),
      );
    }

    if (filter.sortBy === 'title') {
      result = result.sort((a, b) => a.title().localeCompare(b.title()));
    }

    return result;
  });

  /**
   *  Loads from backend all users created exercises
   */
  ngAfterViewInit() {
    this.manager.loadMyExercises();
  }

  /**
   * Opens dialog for creating exercise, dialog then returns title of exercise, which is used for creating empty exercise
   */
  createExercise(): void {
    const dialogRef = this.dialog.open(CreateExerciseDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.manager.createExercise(result);
      }
    });
  }

  setSearch(value: string) {
    this.filter.update((f) => ({
      ...f,
      search: value,
    }));
  }

  /**
   * Opens dialog for creating filter rule, dialog then returns filter rules which will be applied for filtering exercises
   */
  filterExercise() {
    const dialogRef = this.dialog.open(FilterExerciseDialog, {
      width: '500px',
      data: this.filter(), // Use current filter rules
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.filter.set(result);
      }
    });
  }
}
