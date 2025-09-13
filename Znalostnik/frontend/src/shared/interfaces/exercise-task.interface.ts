import { IExerciseTaskBlock } from '@shared/interfaces/exercise-task-block.interface';
import { TaskDocumentSchemaKey } from '@shared/types/task-document-schema-key.type';

export interface IExerciseTask {
  id: string;
  taskDocumentSchema: TaskDocumentSchemaKey;
  taskBlocks: IExerciseTaskBlock[];
}
