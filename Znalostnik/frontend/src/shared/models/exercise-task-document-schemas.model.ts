import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise-task-document-schema.interface';

export const ExerciseTaskDocumentSchemas: ExerciseTaskDocumentSchema[] = [
  {
    key: 'quiz',
    alias: { cs: 'Kvíz', en: 'Quiz' },
    requiredBody: ['question', 'answer'],
    renderOrder: ['question', 'answer'],
    bodyMeta: [
      {
        key: 'question',
        alias: { cs: 'Otázka', en: 'Question' },
        defaultTemplate: 'text',
        types: [{ key: 'text', alias: { cs: 'Textová otázka', en: 'Text question' } }],
      },
      {
        key: 'answer',
        alias: { cs: 'Možnosti odpovědí', en: 'Answer options' },
        defaultTemplate: 'multipleChoice',
        types: [
          { key: 'multipleChoice', alias: { cs: 'Výběr z možností', en: 'Multiple choice' } },
          { key: 'trueFalse', alias: { cs: 'Pravda/Lež', en: 'True/False' } },
        ],
      },
    ],
  },
];
