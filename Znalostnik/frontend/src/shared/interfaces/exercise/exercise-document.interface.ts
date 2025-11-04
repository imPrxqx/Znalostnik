import { WritableSignal } from '@angular/core';
import {
  ExerciseTaskDocumentSchemaKey,
  ExerciseTaskBlockMetaKey,
  ExerciseTaskBlockTemplateKey,
} from '@shared/types/exercise-key.type';
import { ExerciseTask } from './exercise-task.interface';

export interface ExerciseDocument {
  tasks: ExerciseTask[];
}
