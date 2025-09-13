import { TaskBlockTypeKey } from '@shared/types/task-block-type-key.type';

export interface IExerciseTaskBlock {
  taskBlockSchema: TaskBlockTypeKey;
  taskBlockTemplate: TaskBlockTypeKey;
  metadata: {
    data?: Record<string, any>;
    solution?: Record<string, any>;
    feedback?: Record<string, any>;
  };
}
