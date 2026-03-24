import { CommonModule } from '@angular/common';
import { Component, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuizTask } from '@shared/models/format';

interface QuizAnswer {
  id: string;
  created: string;
  submit: Array<string>;
  evaluation?: {
    correct: Array<string>;
    incorrect: Array<string>;
  };
}

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

      const submit = current.submit;

      if (submit.includes(optionId)) {
        current.submit = submit.filter((id) => id !== optionId);
      } else {
        current.submit = [...submit, optionId];
      }

      return current;
    });
  }

  isSelected(optionId: string) {
    if (this.answer()?.evaluation) {
      return false;
    }

    return this.answer()?.submit?.includes(optionId);
  }

  isCorrect(optionId: string) {
    return this.answer()?.evaluation?.correct.includes(optionId);
  }

  isIncorrect(optionId: string) {
    return this.answer()?.evaluation?.incorrect.includes(optionId);
  }
}
