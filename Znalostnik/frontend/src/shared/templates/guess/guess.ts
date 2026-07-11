import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Text } from '@shared/media/text/text';
import { ActivityComponent, ActivityMode } from '@shared/models/activity';
import { GuessActivity, GuessAnswer } from '@shared/models/guess';

@Component({
  selector: 'app-guess',
  imports: [CommonModule, FormsModule, Text, MatIconModule],
  templateUrl: './guess.html',
  styleUrl: './guess.scss',
})
export class Guess implements ActivityComponent {
  mode = input.required<ActivityMode>();
  model = input.required<GuessActivity>();
  answer = model<GuessAnswer>();

  setAnswer(text: string) {
    this.answer.update((current: GuessAnswer | undefined) => {
      if (!current) {
        return current;
      }

      current.submit.selected = text;

      return current;
    });
  }

  hasAnswer() {
    return this.answer();
  }

  isIncorrect(text: string) {
    const answer = this.answer();
    const solution = this.model().solution();

    if (!answer || !solution) {
      return false;
    }

    return answer.submit.selected === text && solution.correct !== text;
  }
}
