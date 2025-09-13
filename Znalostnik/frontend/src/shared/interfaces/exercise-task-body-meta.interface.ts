import { TaskBlockMetaKey } from '@shared/types/task-block-meta-key.type';
import { Locale } from '@shared/types/locale.type';
import { IExerciseTaskBlockType } from '@shared/interfaces/exercise-task-block-type.interface';
import { TaskBlockTypeKey } from '@shared/types/task-block-type-key.type';

export interface ITaskBodyMeta {
  key: TaskBlockMetaKey;
  alias: Locale;
  defaultTemplate: TaskBlockTypeKey;
  types: IExerciseTaskBlockType[];
}
