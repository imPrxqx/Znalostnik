import { Input, Output, EventEmitter, Type, Directive } from '@angular/core';
import { TextBlock } from '../../../shared/text-block/text-block';
import { MultipleChoiceBlock } from '../../../shared/multiple-choice-block/multiple-choice-block';
import { TrueFalseBlock } from '../../../shared/true-false-block/true-false-block';

@Directive()
export abstract class BaseBlockComponent<T = any> {
  @Input() exerciseId!: string;
  @Input() metadata!: T;
  @Input() editable: boolean = true;
  @Input() answered?: any;
  @Output() changed?: EventEmitter<void>;
  @Output() answer?: EventEmitter<any>;
}

export const BlockRegistry: Record<string, Type<BaseBlockComponent>> = {
  [TextBlock.blockTemplate]: TextBlock,
  [MultipleChoiceBlock.blockTemplate]: MultipleChoiceBlock,
  [TrueFalseBlock.blockTemplate]: TrueFalseBlock,
};

export const DocumentSchemas: Record<
  string,
  {
    alias: { cs: string; en: string };
    requiredBody: string[];
    bodyMeta: Record<
      string,
      {
        types: { key: string; alias: { cs: string; en: string } }[];
        alias: { cs: string; en: string };
        defaultTemplate: string;
      }
    >;
    renderOrder: string[];
  }
> = {
  quiz: {
    alias: {
      cs: 'Kvíz',
      en: 'Quiz',
    },
    requiredBody: ['quizText', 'quizOption'],
    bodyMeta: {
      quizText: {
        types: [
          {
            key: 'text',
            alias: {
              cs: 'Textová otázka',
              en: 'Text question',
            },
          },
        ],
        alias: {
          cs: 'Otázka',
          en: 'Question',
        },
        defaultTemplate: 'text',
      },
      quizOption: {
        types: [
          {
            key: 'multipleChoice',
            alias: {
              cs: 'Výběr z možností',
              en: 'Multiple choice',
            },
          },
          {
            key: 'trueFalse',
            alias: {
              cs: 'Pravda/Lež',
              en: 'True/False',
            },
          },
        ],
        alias: {
          cs: 'Možnosti odpovědí',
          en: 'Answer options',
        },
        defaultTemplate: 'multipleChoice',
      },
    },
    renderOrder: ['quizText', 'quizOption'],
  },
  puzzle: {
    alias: {
      cs: 'Puzzle',
      en: 'Puzzle',
    },
    requiredBody: ['puzzleContent'],
    bodyMeta: {
      puzzleContent: {
        types: [
          {
            key: 'puzzleContent',
            alias: {
              cs: 'Puzzle blok',
              en: 'Puzzle block',
            },
          },
        ],
        alias: {
          cs: 'Puzzle obsah',
          en: 'Puzzle content',
        },
        defaultTemplate: 'puzzleContent',
      },
    },
    renderOrder: ['puzzleContent'],
  },
};
