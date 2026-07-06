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
  filter = signal<ExerciseFilter>({
    search: '',
    tagIds: [] as string[],
    sortBy: 'newest',
  });
  dialog = inject(MatDialog);

  filteredExercises = computed(() => {
    const exercises = this.exercises();
    const filter = this.filter();
    const search = filter.search.toLowerCase().trim();

    let result = exercises.filter((e) => {
      const matchSearch = !search || e.title().toLowerCase().includes(search);
      const matchTags = filter.tagIds.every((tagId) => e.tags().some((tag) => tag.id === tagId));
      return matchSearch && matchTags;
    });

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

  ngAfterViewInit() {
    this.manager.loadMyExercises();
  }

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

  filterExercise() {
    const dialogRef = this.dialog.open(FilterExerciseDialog, {
      width: '500px',
      data: this.filter(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.filter.set(result);
      }
    });
  }
}
