import {
  Input,
  Output,
  EventEmitter,
  Type,
  Directive,
  OutputEmitterRef,
  InputSignal,
  WritableSignal,
} from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { MultipleChoiceBlock } from '@shared/blocks/multiple-choice-block/multiple-choice-block';
import { TrueFalseBlock } from '@shared/blocks/true-false-block/true-false-block';
import { CommandUIItem } from '@shared/interfaces/command/command-items.interface';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise/exercise-task-block.interface';
import { BaseBlockMetadata } from '@shared/interfaces/exercise/exercise-task-block-metadata.interface';

@Directive()
export abstract class BaseBlockComponent<T extends BaseBlockMetadata> {
  @Input() exerciseId!: string;
  @Input() answered?: any;
  block!: InputSignal<WritableSignal<ExerciseTaskBlock<T>>>;
  commandCreated!: OutputEmitterRef<Command>;
  commandList!: OutputEmitterRef<CommandUIItem[]>;
}

export const ExerciseTaskBlockComponents: Record<string, Type<BaseBlockComponent<any>>> = {
  [TextBlock.blockTemplate]: TextBlock,
  [MultipleChoiceBlock.blockTemplate]: MultipleChoiceBlock,
  // [TrueFalseBlock.blockTemplate]: TrueFalseBlock,
};
