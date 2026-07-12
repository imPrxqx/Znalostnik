import { Type } from '@angular/core';
import { UpdateMultiChoiceCommandUi } from '@shared/commands/components/update-multi-choice-command-ui/update-multi-choice-command-ui';
import { UpdateTextCommandUi } from '@shared/commands/components/update-text-command-ui/update-text-command-ui';
import { Guess } from '@shared/templates/guess/guess';
import { MatchUp } from '@shared/templates/match-up/match-up';
import { PutInOrder } from '@shared/templates/put-in-order/put-in-order';
import { Quiz } from '@shared/templates/quiz/quiz';
import { GuessActivity, GuessAnswer } from './guess';
import { MatchUpActivity, MatchUpAnswer } from './match-up';
import { PutInOrderActivity, PutInOrderAnswer } from './put-in-order';
import { QuizActivity, QuizAnswer } from './quiz';
import { Activity, ActivityComponent } from './activity';
import { ActivityAnswer } from './activity-answer';
import { UpdateTextSolutionCommandUi } from '@shared/commands/components/update-text-solution-command-ui/update-text-solution-command-ui';
import { UpdatePutInOrderCommandUi } from '@shared/commands/components/update-put-in-order-command-ui/update-put-in-order-command-ui';
import { UpdateMatchUpCommandUi } from '@shared/commands/components/update-match-up-command-ui/update-match-up-command-ui';
import { FieldContext } from '@shared/interfaces/field-context';

export interface ActivityDefinition {
  key: string;
  activity: Type<Activity>;
  component: Type<ActivityComponent>;
  answer: Type<ActivityAnswer>;
  icon: string;
  name: string;
  shortDescription: string;
  longDescription: string;
}

export interface CommandUiDefinition {
  component: Type<unknown>;
  supports: (field: FieldContext) => boolean;
}

export class RegistryActivity {
  static readonly activities: readonly ActivityDefinition[] = [
    {
      key: 'quiz',
      activity: QuizActivity,
      component: Quiz,
      answer: QuizAnswer,
      icon: 'quiz',
      name: $localize`:@@activity.quiz.name:Kvíz`,
      shortDescription: $localize`:@@activity.quiz.short:Výběr správné odpovědi z možností`,
      longDescription: $localize`:@@activity.quiz.long:Výběr jedné nebo více odpovědí pro rychlé ověření znalostí`,
    },
    {
      key: 'guess',
      activity: GuessActivity,
      component: Guess,
      answer: GuessAnswer,
      icon: 'edit_note',
      name: $localize`:@@activity.guess.name:Doplňovačka`,
      shortDescription: $localize`:@@activity.guess.short:Doplnění chybějícího slova`,
      longDescription: $localize`:@@activity.guess.long:Textové odpovědi, kde účastník doplňuje nebo hádá správné znění odpovědi`,
    },
    {
      key: 'matchUp',
      activity: MatchUpActivity,
      component: MatchUp,
      answer: MatchUpAnswer,
      icon: 'schema',
      name: $localize`:@@activity.matchUp.name:Přiřazování`,
      shortDescription: $localize`:@@activity.matchUp.short:Spojování správných dvojic položek`,
      longDescription: $localize`:@@activity.matchUp.long:Spojování položek do správných dvojic`,
    },
    {
      key: 'putInOrder',
      activity: PutInOrderActivity,
      component: PutInOrder,
      answer: PutInOrderAnswer,
      icon: 'format_list_numbered',
      name: $localize`:@@activity.putInOrder.name:Seřazování`,
      shortDescription: $localize`:@@activity.putInOrder.short:Uspořádání položek do správného pořadí`,
      longDescription: $localize`:@@activity.putInOrder.long:Uspořádání položek do správného pořadí.`,
    },
  ];

  static readonly commands: CommandUiDefinition[] = [
    {
      component: UpdateTextCommandUi,
      supports: (f) => f.capabilities.includes('edit-text'),
    },
    {
      component: UpdateMultiChoiceCommandUi,
      supports: (f) => f.capabilities.includes('edit-choices'),
    },
    {
      component: UpdateTextSolutionCommandUi,
      supports: (f) => f.capabilities.includes('edit-text-solution'),
    },
    {
      component: UpdatePutInOrderCommandUi,
      supports: (f) => f.capabilities.includes('edit-put-in-order'),
    },
    {
      component: UpdateMatchUpCommandUi,
      supports: (f) => f.capabilities.includes('edit-match-up-choices'),
    },
  ];

  static getActivity(key: string): ActivityDefinition {
    const activity = this.activities.find((a) => a.key === key);

    if (!activity) {
      throw new Error(`Unknown activity '${key}'.`);
    }

    return activity;
  }

  static createActivity(key: string, config: unknown): Activity {
    const activityClass = this.getActivity(key).activity;
    return new activityClass(config);
  }

  static createAnswer(key: string, config: unknown): ActivityAnswer {
    const activityAnswer = this.getActivity(key).answer;
    return new activityAnswer(config);
  }

  static getActivityComponent(key: string): Type<unknown> {
    return this.getActivity(key).component;
  }

  static getCommands(): CommandUiDefinition[] {
    return this.commands;
  }
}
