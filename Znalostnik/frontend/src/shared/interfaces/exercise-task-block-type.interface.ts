import { TaskBlockTypeKey } from '@shared/types/task-block-type-key.type';
import { Locale } from '@shared/types/locale.type';

export interface IExerciseTaskBlockType {
  key: TaskBlockTypeKey;
  alias: Locale;
}
