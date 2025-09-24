import { ExerciseTaskDocumentSchema } from '@shared/interfaces/exercise/exercise-task.interface';

export const ExerciseTaskDocumentSchemas: ExerciseTaskDocumentSchema[] = [
  {
    key: 'quiz',
    alias: $localize`:@@document.quiz:Kvíz`,
    requiredBody: ['question', 'answer'],
    renderOrder: ['question', 'answer'],
    bodyMeta: [
      {
        key: 'question',
        alias: $localize`:@@document.quiz.question:Otázka`,
        defaultTemplate: 'text',
        allowedTemplates: ['text'],
      },
      {
        key: 'answer',
        alias: $localize`:@@document.quiz.answer:Odpověd`,
        defaultTemplate: 'multipleChoice',
        allowedTemplates: ['multipleChoice', 'trueFalse'],
      },
    ],
  },
];
