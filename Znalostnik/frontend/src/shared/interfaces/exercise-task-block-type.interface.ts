import { ExerciseTaskBlockTypeKey } from '@shared/types/exercise-task-block-type-key.type';
import { Locale } from '@shared/types/locale.type';

export interface ExerciseTaskBlockType {
  key: ExerciseTaskBlockTypeKey;
  alias: Locale;
}
