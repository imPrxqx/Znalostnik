import { Input, Output, EventEmitter, Type, Directive, OutputEmitterRef } from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { MultipleChoiceBlock } from '@shared/blocks/multiple-choice-block/multiple-choice-block';
import { TrueFalseBlock } from '@shared/blocks/true-false-block/true-false-block';
import { CommandUIItem } from '@shared/interfaces/command/command-items.interface';
@Directive()
export abstract class BaseBlockComponent<T = any> {
  @Input() exerciseId!: string;
  @Input() metadata!: T;
  @Input() editable: boolean = true;
  @Input() answered?: any;
  @Output() changed?: EventEmitter<void>;
  @Output() answer?: EventEmitter<any>;
  commandCreated!: OutputEmitterRef<Command>;
  commandList!: OutputEmitterRef<CommandUIItem[]>;
}

export const ExerciseTaskBlockComponents: Record<string, Type<BaseBlockComponent>> = {
  [TextBlock.blockTemplate]: TextBlock,
  [MultipleChoiceBlock.blockTemplate]: MultipleChoiceBlock,
  [TrueFalseBlock.blockTemplate]: TrueFalseBlock,
};
