import { Exercise } from './exercise';
import { ActivityFactory } from './activity-factory';

export class ExerciseFactory {
  static createFromJson(json: any): Exercise {
    const exercise = new Exercise();
    exercise.id.set(json.id);
    exercise.title.set(json.title);

    json.activities?.forEach((definition: any) => {
      const activity = ActivityFactory.createFromJson(definition);
      exercise.addActivity(activity);
    });

    return exercise;
  }
}
