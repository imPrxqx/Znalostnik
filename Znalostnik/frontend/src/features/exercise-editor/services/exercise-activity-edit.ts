import { Injectable, inject, linkedSignal, computed } from '@angular/core';
import { ExerciseDocumentManager } from './exercise-document-manager';
import { Activity } from '@shared/models/activity';

@Injectable({
  providedIn: 'root',
})
export class ExerciseActivityEdit {
  private exerciseDocumentService = inject(ExerciseDocumentManager);
  private lastSelectedActivityId: string | undefined = undefined;

  activity = linkedSignal<Activity[], Activity | undefined>({
    source: computed(() => this.exerciseDocumentService.exercise().getActivities()()),
    computation: (source) => {
      if (source.length === 0) {
        this.lastSelectedActivityId = undefined;
        return undefined;
      }

      if (this.lastSelectedActivityId !== undefined) {
        const index = source.findIndex((activity) => activity.id() === this.lastSelectedActivityId);
        if (index !== -1) {
          return source[index];
        }
      }

      this.lastSelectedActivityId = source[0].id();
      return source[0];
    },
  });

  editActivity(activityId: string): void {
    this.lastSelectedActivityId = activityId;
    this.activity.set(this.exerciseDocumentService.getActivityById(activityId));
  }

  getEditActivity(): Activity | undefined {
    return this.activity();
  }
}
