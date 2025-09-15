import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';
import { Locale } from '@shared/types/locale.type';
import { ExerciseTaskBlockType } from '@shared/interfaces/exercise-task-block-type.interface';
import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';

export interface ExerciseTaskBodyMeta {
  key: ExerciseTaskBlockMetaKey;
  alias: Locale;
  defaultTemplate: ExerciseTaskBlockTemplateKey;
  types: ExerciseTaskBlockType[];
}
