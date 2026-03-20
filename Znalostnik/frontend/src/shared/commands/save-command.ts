import { ExercisesManager } from '@features/dashboard/services/exercises-manager';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { ExerciseFactory, ExportJsonVisitor } from '@shared/models/format';

export class SaveCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private receiver2: ExercisesManager;

  constructor(receiver: ExerciseDocumentManager, receiver2: ExercisesManager) {
    this.receiver = receiver;
    this.receiver2 = receiver2;
  }

  undo(): void {}

  execute(): boolean {
    const visitor = new ExportJsonVisitor();
    visitor.visitExercise(this.receiver.exercise());
    const json = visitor.toJson();
    this.receiver2.saveExercise(this.receiver.exercise().id(), json);
    return false;
  }
}
