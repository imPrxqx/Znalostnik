import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { Choice } from '@shared/blocks/choice/choice';
import { Text } from '@shared/blocks/text/text';
import { ActivityComponent, ActivityMode } from '@shared/models/activity';
import { QuizAnswer, QuizActivity } from '@shared/models/quiz';

/**
 * Displays a quiz activity in three view mode and manages answer
 */
@Component({
  selector: 'app-quiz',
  imports: [CommonModule, Text, Choice],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz implements ActivityComponent {
  mode = input.required<ActivityMode>();
  model = input.required<QuizActivity>();
  answer = model<QuizAnswer>();

  setAnswer(optionId: string) {
    this.answer.update((current: QuizAnswer | undefined) => {
      if (!current) {
        return current;
      }

      const submit = current.submit.selected;

      if (submit.includes(optionId)) {
        current.submit.selected = submit.filter((id) => id !== optionId);
      } else {
        current.submit.selected = [...submit, optionId];
      }

      return current;
    });
  }

  isSelected(optionId: string) {
    return this.answer()?.submit?.selected.includes(optionId);
  }

  isCorrect(optionId: string) {
    const answer = this.answer();
    const solution = this.model().solution();

    if (answer && !solution) {
      return false;
    }

    return solution?.correct.includes(optionId);
  }
}
