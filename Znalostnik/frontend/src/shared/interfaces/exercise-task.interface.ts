import { ExerciseTaskBlock } from '@shared/interfaces/exercise-task-block.interface';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';

export interface ExerciseTask {
  id: string;
  exerciseTaskDocumentSchema: ExerciseTaskDocumentSchemaKey;
  exerciseTaskBlocks: ExerciseTaskBlock[];
}
