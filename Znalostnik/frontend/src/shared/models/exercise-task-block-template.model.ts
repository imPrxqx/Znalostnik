import { ExerciseTaskBlockTemplate } from '@shared/interfaces/exercise/exercise-task-block.interface';

export const ExerciseBlockTemplates: ExerciseTaskBlockTemplate[] = [
  {
    key: 'text',
    alias: { cs: 'Text', en: 'Text' },
    defaultMetadata: { data: { content: 'text' } },
  },
  {
    key: 'multipleChoice',
    alias: { cs: 'Výběr z možností', en: 'Multiple choice' },
    defaultMetadata: { data: { options: [] } },
  },
  {
    key: 'trueFalse',
    alias: { cs: 'Pravda/Lež', en: 'True/False' },
    defaultMetadata: { data: { options: [{ true: 'True', false: 'False' }] } },
  },
];
