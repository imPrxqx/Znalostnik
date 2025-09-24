import { Component, input } from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise/exercise-task-block.interface';
import { ExerciseTask } from '@shared/interfaces/exercise/exercise-task.interface';
import { BaseBlockMetadata } from '@shared/interfaces/exercise/exercise-task-block-metadata.interface';
import { BaseBlockComponent } from '@shared/models/exercise-task-block-components.model';

export class UpdateBlockMetadataCommand implements Command {
  private receiver: BaseBlockComponent<any>;
  private backup: BaseBlockMetadata;
  private newMetadata: BaseBlockMetadata;

  constructor(receiver: BaseBlockComponent<any>, newMetadata: string) {
    this.receiver = receiver;
    this.backup = structuredClone(receiver.block()().metadata);
    this.newMetadata = newMetadata;
  }

  undo(): void {
    const blockInstance = this.receiver.block()();
    this.receiver.block().set({
      ...blockInstance,
      metadata: this.newMetadata,
    });
  }

  execute(): void {
    const blockInstance = this.receiver.block()();
    this.receiver.block().set({
      ...blockInstance,
      metadata: this.backup,
    });
  }
}
