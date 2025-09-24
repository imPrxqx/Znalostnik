import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';
import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';
import { BaseBlockMetadata } from './exercise-task-block-metadata.interface';
import {
  TextBlockMetadata,
  MultipleChoiceBlockMetadata,
  TrueFalseBlockMetadata,
} from '@shared/interfaces/exercise/exercise-task-block-metadata.interface';

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
