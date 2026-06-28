import { signal, WritableSignal } from '@angular/core';
import { Activity } from './activity';
import { Visitor, Element } from '../interfaces/visitor';
import { v4 as uuidv4 } from 'uuid';
import { Tag } from './tag';

export class Exercise implements Element {
  id = signal<string>(uuidv4());
  title = signal<string>('');
  activities = signal<Activity[]>([]);
  tags = signal<Tag[]>([]);
  createdAt = signal<string>('');
  updatedAt = signal<string>('');

  deleteActivity(activity: Activity): void {
    const currentActivities = [...this.activities()];
    const index = currentActivities.indexOf(activity);
    if (index !== -1) {
      currentActivities.splice(index, 1);
      this.activities.set(currentActivities);
    }
    this.reindex();
  }

  deleteActivityById(activityId: string): void {
    const currentActivities = [...this.activities()];
    const index = currentActivities.findIndex((activity) => activity.id() === activityId);
    if (index !== -1) {
      currentActivities.splice(index, 1);
      this.activities.set(currentActivities);
    }
    this.reindex();
  }

  addActivity(activity: Activity): void {
    const currentActivities = [...this.activities()];
    currentActivities.push(activity);
    this.activities.set(currentActivities);
    this.reindex();
  }

  addActivityAt(activity: Activity, index: number): void {
    const currentActivities = [...this.activities()];
    currentActivities.splice(index, 0, activity);
    this.activities.set(currentActivities);
    this.reindex();
  }

  moveActivity(from: number, to: number): void {
    const currentActivities = [...this.activities()];
    const maxIndex = currentActivities.length - 1;

    if (from < 0 || from > maxIndex) {
      return;
    }

    if (to < 0) {
      to = 0;
    }

    if (to > maxIndex) {
      to = maxIndex;
    }

    const [activityToMove] = currentActivities.splice(from, 1);
    currentActivities.splice(to, 0, activityToMove);
    this.activities.set(currentActivities);
    this.reindex();
  }

  getActivities(): WritableSignal<Activity[]> {
    return this.activities;
  }

  getActivityById(activityId: string): Activity | undefined {
    return this.activities().find((activity) => activity.id() === activityId);
  }

  getActivityIndexById(activityId: string): number {
    return this.activities().findIndex((activity) => activity.id() === activityId);
  }

  accept(visitor: Visitor): void {
    visitor.visitExercise(this);
  }

  reindex() {
    this.activities().map((activity, index) => {
      activity.order.set(index);
      return activity;
    });
  }
}
