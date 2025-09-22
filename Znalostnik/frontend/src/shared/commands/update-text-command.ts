import { Component, input } from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise-task-block.interface';
import { ExerciseTask } from '@shared/interfaces/exercise-task.interface';

export class UpdateTextCommand implements Command {
  private receiver: TextBlock;
  private backup: ExerciseTaskBlock;
  private newText: string;

  constructor(receiver: TextBlock, newText: string) {
    this.receiver = receiver;
    this.backup = structuredClone(receiver.block()());
    this.newText = newText;
  }

  undo(): void {
    this.receiver.block().set(this.backup);
  }

  execute(): void {
    this.receiver.applyText(this.newText);
  }
}
