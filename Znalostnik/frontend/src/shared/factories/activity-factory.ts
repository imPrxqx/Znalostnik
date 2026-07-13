import { RegistryActivity } from '@shared/registry/registry-activity';
import { Activity } from '../models/activity';

export class ActivityFactory {
  static createFromJson(json: unknown): Activity {
    const data = json as { type: string };
    const activity = RegistryActivity.createActivity(data.type, json);
    return activity;
  }
}
