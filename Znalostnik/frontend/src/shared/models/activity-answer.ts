export abstract class ActivityAnswer {
  id: any;
  activityId: string = '';
  version: number = 0;
  abstract created: string;
  abstract submit: any;
  abstract correctPercentage?: any;
  abstract status?: any;
}
