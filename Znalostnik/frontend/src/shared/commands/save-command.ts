import { ExercisesManager } from '@features/dashboard/services/exercises-manager';
import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { Command } from '@shared/interfaces/command.interface';
import { ExportJsonVisitor } from '@shared/exporters/json-export';

export class SaveCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private receiver2: ExercisesManager;
  private exerciseId: string;

  constructor(receiver: ExerciseDocumentManager, receiver2: ExercisesManager, exerciseId: string) {
    this.receiver = receiver;
    this.receiver2 = receiver2;
    this.exerciseId = exerciseId;
  }

  undo(): void {
    return;
  }

  execute(): boolean {
    const visitor = new ExportJsonVisitor();
    visitor.visitExercise(this.receiver.exercise());
    const json = visitor.toJson();
    this.receiver2.saveExercise(this.exerciseId, json);
    return false;
  }
}
