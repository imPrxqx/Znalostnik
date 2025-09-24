import { WritableSignal } from '@angular/core';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise/exercise-task-block.interface';
import { ExerciseTaskDocumentSchemaKey } from '@shared/types/exercise-task-document-schema-key.type';
import { ExerciseTaskBlockMetaKey } from '@shared/types/exercise-task-block-meta-key.type';
import { ExerciseTaskBlockTemplateKey } from '@shared/types/exercise-task-block-template-key.type';

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
