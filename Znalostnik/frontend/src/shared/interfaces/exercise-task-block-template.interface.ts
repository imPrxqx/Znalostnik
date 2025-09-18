import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';
import { Locale } from '@shared/types/locale.type';

export interface ExerciseTaskBlockTemplate {
  key: ExerciseTaskBlockTemplateKey;
  alias: Locale;
  defaultMetadata: {
    data?: Record<string, any>;
    solution?: Record<string, any>;
    feedback?: Record<string, any>;
  };
}
