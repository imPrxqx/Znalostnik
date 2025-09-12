export interface TaskBlockModel {
  blockSchema: string;
  blockTemplate: string;
  metadata: {
    data?: Record<string, any>;
    solution?: Record<string, any>;
    feedback?: Record<string, any>;
  };
}
