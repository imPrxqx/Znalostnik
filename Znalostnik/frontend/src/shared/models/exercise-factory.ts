import { Exercise } from './exercise';
import { ActivityFactory } from './activity-factory';
import { Tag } from './tag';

export class ExerciseFactory {
  static createFromJson(json: any): Exercise {
    const exercise = new Exercise();
    console.log(json);
    exercise.id.set(json.id);
    exercise.title.set(json.title);
    exercise.updatedAt.set(json.updatedAt);
    exercise.createdAt.set(json.createdAt);
    exercise.tags.set(json.tags);

    json.activities?.forEach((definition: any) => {
      const activity = ActivityFactory.createFromJson(definition);
      exercise.addActivity(activity);
    });

    return exercise;
  }
}
