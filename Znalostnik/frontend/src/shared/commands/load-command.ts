import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { ExerciseFactory } from '@shared/models/format';

export class LoadCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private backup: any;
  private loadExercise: any;

  constructor(receiver: ExerciseDocumentManager, loadExercise: any) {
    this.receiver = receiver;
    this.backup = receiver.exercise();
    this.loadExercise = loadExercise;
  }

  undo(): void {
    this.receiver.exercise.set(this.backup);
  }

  execute(): boolean {
    const exercise = ExerciseFactory.createFromJson(this.loadExercise);
    this.receiver.loadDocument(exercise);
    return true;
  }
}
