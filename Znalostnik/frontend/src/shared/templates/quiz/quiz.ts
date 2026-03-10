import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuizTask } from '@shared/models/format';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  model = input.required<QuizTask>();
  answer = model<any>(null);

  setAnswer(optionId: string) {}
}
