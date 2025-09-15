import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';
import { Locale } from '@shared/types/locale.type';

export interface ExerciseTaskBlockType {
  key: ExerciseTaskBlockTemplateKey;
  alias: Locale;
}
