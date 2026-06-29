import { Component, input, model, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MatchUpActivity, MatchUpAnswer } from '@shared/models/match-up';
import { CommonModule } from '@angular/common';
import { Text } from '@shared/media/text/text';
import { Choice } from '@shared/media/choice/choice';

@Component({
  selector: 'app-match-up',
  imports: [CommonModule, CdkDropList, CdkDrag, Text, Choice],
  templateUrl: './match-up.html',
  styleUrl: './match-up.scss',
})
export class MatchUp implements OnInit {
  mode = input.required<string>();
  model = input.required<MatchUpActivity>();
  answer = model<MatchUpAnswer>();

  ngOnInit() {
    if (
      this.answer() &&
      this.answer()!.submit.selected.length === 0 &&
      this.mode() === 'answering'
    ) {
      const left = [...this.model().leftOptions().options].sort(() => Math.random() - 0.5);
      const right = [...this.model().rightOptions().options].sort(() => Math.random() - 0.5);
      const pairs = Math.min(left.length, right.length);

      for (let i = 0; i < pairs; i++) {
        this.answer()?.submit.selected.push({
          leftId: left[i].id,
          rightId: right[i].id,
        });
      }
    }
  }

  hasAnswer() {
    return this.answer() && this.answer()!.submit.selected.length > 0;
  }

  getLeftOptionById(id: string) {
    return this.model()
      .leftOptions()
      .options.find((o) => o.id === id);
  }

  getRightOptionById(id: string) {
    return this.model()
      .rightOptions()
      .options.find((o) => o.id === id);
  }

  dropLeft(event: CdkDragDrop<unknown[]>) {
    this.answer.update((current) => {
      if (!current) {
        return current;
      }

      const submit = current.submit.selected;
      const movedItem = submit[event.previousIndex];
      const targetItem = submit[event.currentIndex];
      const tempLeftId = movedItem.leftId;
      movedItem.leftId = targetItem.leftId;
      targetItem.leftId = tempLeftId;

      return current;
    });
  }

  dropRight(event: CdkDragDrop<unknown[]>) {
    this.answer.update((current) => {
      if (!current) {
        return current;
      }

      const submit = current.submit.selected;
      const movedItem = submit[event.previousIndex];
      const targetItem = submit[event.currentIndex];
      const tempRightId = movedItem.rightId;
      movedItem.rightId = targetItem.rightId;
      targetItem.rightId = tempRightId;

      return current;
    });
  }

  isCorrect(index: number): boolean {
    const answer = this.answer();
    const solution = this.model().solution();

    if (!answer || !solution) {
      return false;
    }

    const pair = answer.submit.selected[index];
    if (!pair) {
      return false;
    }

    return solution.correct.some((p) => p.leftId === pair.leftId && p.rightId === pair.rightId);
  }
}
