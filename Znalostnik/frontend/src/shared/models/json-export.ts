import { Exercise } from './exercise';
import { GuessActivity } from './guess';
import { MatchUpActivity } from './match-up';
import { PutInOrderActivity } from './put-in-order';
import { QuizActivity } from './quiz';
import { Activity } from './activity';
import { Visitor } from '../interfaces/visitor';

export interface ExportedActivity {
  type: string;
  order: number;
  style: unknown;
  content: unknown;
  solution: unknown;
}

interface ExportedExercise {
  title: string;
  activities: Activity[];
}

export class ExportJsonVisitor implements Visitor {
  private result: unknown = {};

  visitExercise(exercise: Exercise) {
    const result: ExportedExercise = {
      title: exercise.title(),
      activities: [],
    };

    exercise.activities().forEach((activity: Activity) => {
      const activityVisitor = new ExportJsonVisitor();
      activity.accept(activityVisitor);
      result.activities.push(activityVisitor.result as Activity);
    });

    this.result = result;
    console.log(this.result);
  }

  visitQuiz(quizActivity: QuizActivity): void {
    this.result = {
      type: quizActivity.type(),
      order: quizActivity.order(),
      style: quizActivity.style(),
      content: {
        text: quizActivity.content().text(),
        style: quizActivity.content().style(),
        options: quizActivity.options().options.map((option) => ({
          id: option.id,
          text: option.text(),
          style: option.style(),
          media: option.media()
            ? {
                id: option.media()!.id,
                contentType: option.media()!.contentType,
              }
            : undefined,
        })),
      },
      solution: quizActivity.solution(),
    };
  }

  visitGuess(guessActivity: GuessActivity): void {
    this.result = {
      type: guessActivity.type(),
      order: guessActivity.order(),
      style: guessActivity.style(),
      content: {
        text: guessActivity.content().text(),
        style: guessActivity.content().style(),
      },
      solution: guessActivity.solution(),
    };
  }

  visitMatchUp(matchUpActivity: MatchUpActivity): void {
    this.result = {
      type: matchUpActivity.type(),
      order: matchUpActivity.order(),
      style: matchUpActivity.style(),
      content: {
        text: matchUpActivity.content().text(),
        style: matchUpActivity.content().style(),
        leftOptions: matchUpActivity.leftOptions().options.map((option) => ({
          id: option.id,
          text: option.text(),
          style: option.style(),
          media: option.media()
            ? {
                id: option.media()!.id,
                contentType: option.media()!.contentType,
              }
            : undefined,
        })),
        rightOptions: matchUpActivity.rightOptions().options.map((option) => ({
          id: option.id,
          text: option.text(),
          style: option.style(),
          media: option.media()
            ? {
                id: option.media()!.id,
                contentType: option.media()!.contentType,
              }
            : undefined,
        })),
      },
      solution: matchUpActivity.solution(),
    };
  }

  visitPutInOrder(putInOrderActivity: PutInOrderActivity): void {
    this.result = {
      type: putInOrderActivity.type(),
      order: putInOrderActivity.order(),
      style: putInOrderActivity.style(),
      content: {
        text: putInOrderActivity.content().text(),
        style: putInOrderActivity.content().style(),
        options: putInOrderActivity.options().options.map((option) => ({
          id: option.id,
          text: option.text(),
          style: option.style(),
          media: option.media()
            ? {
                id: option.media()!.id,
                contentType: option.media()!.contentType,
              }
            : undefined,
        })),
      },
      solution: putInOrderActivity.solution(),
    };
  }

  toJson(): string {
    return JSON.stringify(this.result);
  }
}
