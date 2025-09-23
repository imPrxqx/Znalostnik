import { Locale } from '@shared/types/locale.type';
import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';
import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';

export interface ExerciseTaskBlock {
  taskBlockSchema: ExerciseTaskBlockMetaKey;
  taskBlockTemplate: ExerciseTaskBlockTemplateKey;
  metadata: {
    data?: Record<string, any>;
    solution?: Record<string, any>;
    feedback?: Record<string, any>;
  };
}

export interface ExerciseTaskBlockTemplate {
  key: ExerciseTaskBlockTemplateKey;
  alias: Locale;
  defaultMetadata: {
    data?: Record<string, any>;
    solution?: Record<string, any>;
    feedback?: Record<string, any>;
  };
}
