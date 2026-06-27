import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { PutInOrderAnswer, PutInOrderActivity } from '@shared/models/put-in-order';
import { Text } from '@shared/media/text/text';
import { Choice } from '@shared/media/choice/choice';

@Component({
  selector: 'app-put-in-order',
  imports: [CommonModule, CdkDropList, CdkDrag, Text, Choice],
  templateUrl: './put-in-order.html',
  styleUrl: './put-in-order.scss',
})
export class PutInOrder {
  mode = input.required<string>();
  model = input.required<PutInOrderActivity>();
  answer = model<PutInOrderAnswer>();

  ngOnInit() {
    if (
      this.answer() &&
      this.answer()!.submit.selected.length === 0 &&
      this.mode() === 'answering'
    ) {
      const order = [...this.model().options().options].sort(() => Math.random() - 0.5);

      order.forEach((option) => {
        this.answer()?.submit.selected.push(option.id);
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    this.answer.update((current) => {
      if (!current) {
        return current;
      }

      const submit = current.submit.selected;

      moveItemInArray(submit, event.previousIndex, event.currentIndex);

      return current;
    });
  }

  getOptionById(id: string) {
    return this.model()
      .options()
      .options.find((o) => o.id === id);
  }

  hasAnswer() {
    return this.answer() && this.answer()!.submit.selected.length > 0;
  }

  isCorrect(index: number) {
    const answer = this.answer();
    const solution = this.model().solution();

    if (!answer || !solution) {
      return false;
    }

    return answer.submit.selected[index] === solution.correct[index];
  }
}
