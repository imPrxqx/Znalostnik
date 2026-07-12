import { Injectable, WritableSignal, signal } from '@angular/core';
import { Exercise } from '@shared/models/exercise';
import { RegistryActivity } from '@shared/models/registry-activity';
import { Activity } from '@shared/models/activity';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class ExerciseDocumentManager {
  exerciseId = signal<string>(uuidv4());
  exercise = signal<Exercise>(new Exercise());

  loadDocument(exercise: Exercise) {
    this.exercise.set(exercise);

    this.exercise()
      .getActivities()()
      .forEach((activity: Activity) => {
        activity.ensureSolution();
      });
  }

  addActivity(activity: Activity): void {
    this.exercise().addActivity(activity);
  }

  addActivityAt(activity: Activity, index: number): void {
    this.exercise().addActivityAt(activity, index);
  }

  createActivity(schema: string): Activity {
    const activity = RegistryActivity.createActivity(schema, undefined)!;
    return activity;
  }

  moveActivity(from: number, to: number): void {
    this.exercise().moveActivity(from, to);
  }

  deleteActivity(activity: Activity): void {
    this.exercise().deleteActivity(activity);
  }

  getActivities(): WritableSignal<Activity[]> {
    return this.exercise().getActivities();
  }

  getActivityById(activityId: string): Activity | undefined {
    return this.exercise().getActivityById(activityId);
  }

  deleteActivityById(activityId: string): void {
    this.exercise().deleteActivityById(activityId);
  }

  getActivityIndexById(activityId: string): number {
    return this.exercise().getActivityIndexById(activityId);
  }
}
