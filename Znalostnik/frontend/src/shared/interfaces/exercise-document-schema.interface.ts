import { Locale } from '@shared/types/locale.type';
import { TaskBlockMetaKey } from '@shared/types/task-block-meta-key.type';
import { TaskDocumentSchemaKey } from '@shared/types/task-document-schema-key.type';
import { ITaskBodyMeta } from '@shared/interfaces/exercise-task-body-meta.interface';

export interface ITaskDocumentSchema {
  key: TaskDocumentSchemaKey;
  alias: Locale;
  requiredBody: TaskBlockMetaKey[];
  renderOrder: TaskBlockMetaKey[];
  bodyMeta: ITaskBodyMeta[];
}
