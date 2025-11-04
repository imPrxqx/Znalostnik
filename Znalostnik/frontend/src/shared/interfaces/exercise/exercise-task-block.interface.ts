import {
  ExerciseTaskBlockMetaKey,
  ExerciseTaskBlockTemplateKey,
} from '@shared/types/exercise-key.type';
import { BaseBlockMetadata } from './exercise-task-block-metadata.interface';

export interface ExerciseTaskBlock<T extends BaseBlockMetadata = BaseBlockMetadata> {
  taskBlockSchema: ExerciseTaskBlockMetaKey;
  taskBlockTemplate: ExerciseTaskBlockTemplateKey;
  metadata: T;
}

export interface ExerciseTaskBlockTemplate<T extends BaseBlockMetadata = BaseBlockMetadata> {
  key: ExerciseTaskBlockTemplateKey;
  alias: string;
  defaultMetadata: () => T;
}
