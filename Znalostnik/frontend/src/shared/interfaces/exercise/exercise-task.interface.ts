import { WritableSignal } from '@angular/core';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise/exercise-task-block.interface';
import {
  ExerciseTaskDocumentSchemaKey,
  ExerciseTaskBlockMetaKey,
  ExerciseTaskBlockTemplateKey,
} from '@shared/types/exercise-key.type';

export interface ExerciseTask {
  id: string;
  exerciseTaskDocumentSchema: ExerciseTaskDocumentSchemaKey;
  exerciseTaskBlocks: WritableSignal<ExerciseTaskBlock>[];
}

export interface ExerciseTaskDocumentSchema {
  key: ExerciseTaskDocumentSchemaKey;
  alias: string;
  requiredBody: ExerciseTaskBlockMetaKey[];
  renderOrder: ExerciseTaskBlockMetaKey[];
  bodyMeta: ExerciseTaskBodyMeta[];
}

export interface ExerciseTaskBodyMeta {
  key: ExerciseTaskBlockMetaKey;
  alias: string;
  defaultTemplate: ExerciseTaskBlockTemplateKey;
  allowedTemplates: ExerciseTaskBlockTemplateKey[];
}
