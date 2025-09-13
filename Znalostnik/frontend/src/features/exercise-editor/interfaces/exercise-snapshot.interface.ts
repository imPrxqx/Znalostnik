import { IExerciseDocument } from '@shared/interfaces/exercise-document.interface';

export interface IExerciseSnapshot {
  selectedTaskId: string | undefined;
  exerciseDocument: IExerciseDocument;
}
