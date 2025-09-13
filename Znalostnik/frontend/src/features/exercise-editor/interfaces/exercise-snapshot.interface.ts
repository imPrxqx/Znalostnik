import { ExerciseDocument } from '@shared/interfaces/exercise-document.interface';

export interface ExerciseSnapshot {
  selectedTaskId: string | undefined;
  exerciseDocument: ExerciseDocument;
}
