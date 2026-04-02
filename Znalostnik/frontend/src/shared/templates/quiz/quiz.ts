import { CommonModule } from '@angular/common';
import { Component, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuizAnswer, QuizTask } from '@shared/models/format';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  model = input.required<QuizTask>();
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

  isSolution(optionId: string) {
    const answer = this.answer();

    if (answer) {
      return undefined;
    }

    const solution = this.model().solution();
    return solution.includes(optionId);
  }

  isCorrect(optionId: string) {
    return this.answer()?.evaluation?.correct?.includes(optionId);
  }

  isIncorrect(optionId: string) {
    return this.answer()?.evaluation?.incorrect?.includes(optionId);
  }
}
