import { Exercise, ExerciseConfiguration } from './exercise';
import { ActivityFactory } from './activity-factory';

export class ExerciseFactory {
  static createFromJson(json: ExerciseConfiguration): Exercise {
    const exercise = new Exercise();

    exercise.id.set(json.id);
    exercise.title.set(json.title);
    exercise.updatedAt.set(json.updatedAt);
    exercise.createdAt.set(json.createdAt);
    exercise.tags.set(json.tags);

    json.activities?.forEach((definition: unknown) => {
      const activity = ActivityFactory.createFromJson(definition);
      exercise.addActivity(activity);
    });

    return exercise;
  }
}
