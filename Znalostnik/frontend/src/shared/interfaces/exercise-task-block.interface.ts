import { ExerciseTaskBlockTypeKey } from '@shared/types/exercise-task-block-type-key.type';

export interface ExerciseTaskBlock {
  taskBlockSchema: ExerciseTaskBlockTypeKey;
  taskBlockTemplate: ExerciseTaskBlockTypeKey;
  metadata: {
    data?: Record<string, any>;
    solution?: Record<string, any>;
    feedback?: Record<string, any>;
  };
}
