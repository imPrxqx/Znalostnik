import { Component, input } from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise/exercise-task-block.interface';
import { ExerciseTask } from '@shared/interfaces/exercise/exercise-task.interface';

export class UpdateTextCommand implements Command {
  private receiver: TextBlock;
  private backup: string;
  private newText: string;

  constructor(receiver: TextBlock, newText: string) {
    this.receiver = receiver;
    this.backup = structuredClone(receiver.block()().metadata.data.content);
    this.newText = newText;
  }

  undo(): void {
    this.receiver.applyText(this.backup);
  }

  execute(): void {
    console.log('Executing UpdateTextCommand with newText:', this.newText);
    this.receiver.applyText(this.newText);
  }
}
