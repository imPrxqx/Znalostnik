import { Registry } from './registry';
import { Activity } from './activity';

export class ActivityFactory {
  static createFromJson(json: any): Activity {
    const activity = Registry.createActivity(json.type, json);
    return activity;
  }
}
