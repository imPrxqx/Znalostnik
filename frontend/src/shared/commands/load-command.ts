import { ExerciseDocumentManager } from '@features/exercise-editor/services/exercise-document-manager';
import { Command } from '@shared/interfaces/command.interface';
import { Exercise, ExerciseConfiguration } from '@shared/models/exercise';
import { ExerciseFactory } from '@shared/factories/exercise-factory';

/**
 * Command for loading exercise to edit.
 */
export class LoadCommand implements Command {
  private receiver: ExerciseDocumentManager;
  private backup: Exercise;
  private loadExercise: ExerciseConfiguration;

  constructor(receiver: ExerciseDocumentManager, loadExercise: ExerciseConfiguration) {
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
