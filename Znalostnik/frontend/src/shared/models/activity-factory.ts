import { Registry } from './registry';
import { Activity } from './activity';

export class ActivityFactory {
  static createFromJson(json: unknown): Activity {
    const data = json as { type: string };
    const activity = Registry.createActivity(data.type, json);
    return activity;
  }
}
