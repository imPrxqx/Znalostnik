import { ExerciseDocumentModel } from '@shared/models/exercise-document.model';

export interface ExerciseSnapshotModel {
  selectedTaskIds: string[] | undefined;
  exerciseDocument: ExerciseDocumentModel;
}
