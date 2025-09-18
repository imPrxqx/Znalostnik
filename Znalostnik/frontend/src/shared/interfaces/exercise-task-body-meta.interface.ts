import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';
import { Locale } from '@shared/types/locale.type';
import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';

export interface ExerciseTaskBodyMeta {
  key: ExerciseTaskBlockMetaKey;
  alias: Locale;
  defaultTemplate: ExerciseTaskBlockTemplateKey;
  allowedTemplates: ExerciseTaskBlockTemplateKey[];
}
