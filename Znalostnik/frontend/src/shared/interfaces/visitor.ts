import { Exercise } from '../models/exercise';
import { GuessActivity } from '../models/guess';
import { MatchUpActivity } from '../models/match-up';
import { PutInOrderActivity } from '../models/put-in-order';
import { QuizActivity } from '../models/quiz';

export interface Element {
  accept(visitor: Visitor): void;
}

export interface Visitor {
  visitQuiz(quizActivity: QuizActivity): void;
  visitGuess(guessActivity: GuessActivity): void;
  visitMatchUp(matchUpActivity: MatchUpActivity): void;
  visitPutInOrder(putInOrderActivity: PutInOrderActivity): void;
  visitExercise(exercise: Exercise): void;
}
