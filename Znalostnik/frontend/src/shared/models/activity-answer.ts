export abstract class ActivityAnswer {
  id = '';
  activityId = '';
  version = 0;
  abstract created: string;
  abstract submit: unknown;
  abstract correctPercentage: number;
  abstract status?: unknown;
}

export abstract class RuntimeActivityAnswer {
  id = '';
  activityId = '';
  version = 0;
  abstract created: string;
  abstract submit: unknown;
  abstract correctPercentage: number;
  abstract status?: unknown;
}
