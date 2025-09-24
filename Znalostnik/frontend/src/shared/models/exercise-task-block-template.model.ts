import { ExerciseTaskBlockTemplate } from '@shared/interfaces/exercise/exercise-task-block.interface';
import { TextBlockMetadata } from '@shared/interfaces/exercise/exercise-task-block-metadata.interface';
import { MultipleChoiceBlockMetadata } from '@shared/interfaces/exercise/exercise-task-block-metadata.interface';
import { TrueFalseBlockMetadata } from '@shared/interfaces/exercise/exercise-task-block-metadata.interface';

function generateId(): string {
  return 'id-' + Math.random().toString(36).substring(2, 7);
}

export const ExerciseBlockTemplates: ExerciseTaskBlockTemplate[] = [
  {
    key: 'text',
    alias: $localize`:@@block.text:Text`,
    defaultMetadata: () =>
      ({
        data: { content: $localize`:@@block.text.defaultContent:Výchozí Text` },
      }) as TextBlockMetadata,
  },
  {
    key: 'multipleChoice',
    alias: $localize`:@@block.multipleChoice:Výběr z možností`,
    defaultMetadata: () =>
      ({
        data: {
          options: [
            {
              id: generateId(),
              content: $localize`:@@block.multipleChoice.option1:Výchozí Možnost 1`,
            },
            {
              id: generateId(),
              content: $localize`:@@block.multipleChoice.option2:Výchozí Možnost 2`,
            },
            {
              id: generateId(),
              content: $localize`:@@block.multipleChoice.option2:Výchozí Možnost 3`,
            },
            {
              id: generateId(),
              content: $localize`:@@block.multipleChoice.option2:Výchozí Možnost 4`,
            },
          ],
        },
        solution: { correctOptions: [] },
      }) as MultipleChoiceBlockMetadata,
  },
];
