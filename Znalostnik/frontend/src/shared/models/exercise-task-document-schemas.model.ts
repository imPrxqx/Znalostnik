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
        allowedTemplates: ['text'],
      },
      {
        key: 'answer',
        alias: { cs: 'Odpovědi', en: 'Answers' },
        defaultTemplate: 'multipleChoice',
        allowedTemplates: ['multipleChoice', 'trueFalse'],
      },
    ],
  },
];
