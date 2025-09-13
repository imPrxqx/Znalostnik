import { Locale } from '@shared/types/locale.type';
import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';
import { ExerciseTaskBodyMeta } from '@shared/interfaces/exercise-task-body-meta.interface';

export interface ExerciseTaskDocumentSchema {
  key: ExerciseTaskDocumentSchemaKey;
  alias: Locale;
  requiredBody: ExerciseTaskBlockMetaKey[];
  renderOrder: ExerciseTaskBlockMetaKey[];
  bodyMeta: ExerciseTaskBodyMeta[];
}
