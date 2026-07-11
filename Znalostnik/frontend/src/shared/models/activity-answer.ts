export abstract class ActivityAnswer {
  id = '';
  activityId = '';
  version = 0;
  submissionId = '';
  abstract createdAt: string;
  abstract submit: unknown;
  abstract correctPercentage: number;
  abstract status?: unknown;
}
