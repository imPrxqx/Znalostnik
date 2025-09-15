import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';
import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';

export interface ExerciseTaskBlock {
  taskBlockSchema: ExerciseTaskBlockMetaKey;
  taskBlockTemplate: ExerciseTaskBlockTemplateKey;
  metadata: {
    data?: Record<string, any>;
    solution?: Record<string, any>;
    feedback?: Record<string, any>;
  };
}
