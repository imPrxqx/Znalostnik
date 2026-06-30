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
import { Activity } from './activity';
import { ActivityAnswer } from './activity-answer';
import { UpdateTextSolutionCommandUi } from '@shared/commands/components/update-text-solution-command-ui/update-text-solution-command-ui';
import { UpdatePutInOrderCommandUi } from '@shared/commands/components/update-put-in-order-command-ui/update-put-in-order-command-ui';
import { UpdateMatchUpCommandUi } from '@shared/commands/components/update-match-up-command-ui/update-match-up-command-ui';
import { ClassicHost } from '@features/session/modes/classic/classic-host/classic-host';
import { HotPotatoHost } from '@features/session/modes/hot-potato/hot-potato-host/hot-potato-host';
import { SelfStudyHost } from '@features/session/modes/self-study/self-study-host/self-study-host';
import { ClassicParticipant } from '@features/session/modes/classic/classic-participant/classic-participant';
import { HotPotatoParticipant } from '@features/session/modes/hot-potato/hot-potato-participant/hot-potato-participant';
import { SelfStudyParticipant } from '@features/session/modes/self-study/self-study-participant/self-study-participant';
import { FieldContext } from '@shared/interfaces/field-context';
import { GameSetting } from './dtos';

export interface ActivityDefinition {
  key: string;
  activity: Type<Activity>;
  component: Type<unknown>;
  answer: Type<ActivityAnswer>;
  icon: string;
  name: string;
  shortDescription: string;
  longDescription: string;
}

export interface GameModeDefinition {
  key: string;
  hostComponent: Type<unknown>;
  participantComponent: Type<unknown>;
  availableGameSettingsKeys: string[];
  icon: string;
  name: string;
  shortDescription: string;
  longDescription: string;
}

export interface GameSettingDefinition {
  key: keyof GameSetting;
  name: string;
  shortDescription: string;
  longDescription: string;
  type: 'number' | 'select';

  options?: {
    key: string;
    name: string;
    icon: string;
    shortDescription: string;
    longDescription: string;
  }[];
}

export interface SessionStatusDefinition {
  key: string;
  name: string;
}

export interface RespondTypeDefinition {
  key: string;
  name: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
}

export interface CommandUiDefinition {
  component: Type<unknown>;
  supports: (field: FieldContext) => boolean;
}

export class Registry {
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

  static readonly gameModes: readonly GameModeDefinition[] = [
    {
      key: 'classic',
      hostComponent: ClassicHost,
      participantComponent: ClassicParticipant,
      availableGameSettingsKeys: ['roundTime', 'scoringMode'],
      icon: 'school',
      name: $localize`:@@gamemode.classic.name:Klasický`,
      shortDescription: $localize`:@@gamemode.classic.short:Standardní průchod cvičením hostitelem`,
      longDescription: $localize`:@@gamemode.classic.long: Aktivity probíhají v předem nastaveném pořadí a každá má časový limit. Po dokončení kola
            se účastníkům zobrazí výsledky a zpětná vazba.`,
    },
    {
      key: 'hotPotato',
      hostComponent: HotPotatoHost,
      participantComponent: HotPotatoParticipant,
      availableGameSettingsKeys: ['roundTime', 'selectionAlgorithm'],
      icon: 'bolt',
      name: $localize`:@@gamemode.hotPotato.name:Horká Brambora`,
      shortDescription: $localize`:@@gamemode.hotPotato.short:Rychlé střídání hráčů pod tlakem časovače`,
      longDescription: $localize`:@@gamemode.hotPotato.long:V každém kole jsou aktivním hráčům přiřazeny „brambory“, z nichž každá obsahuje jednu
            aktivitu. Po uplynutí času jsou nejpomalejší hráči vyřazeni a hra pokračuje, dokud
            nezůstane poslední vítěz.`,
    },
    {
      key: 'selfStudy',
      hostComponent: SelfStudyHost,
      participantComponent: SelfStudyParticipant,
      availableGameSettingsKeys: ['selectionAlgorithm'],
      icon: 'self_improvement',
      name: $localize`:@@gamemode.selfStudy.name:Samostudium`,
      shortDescription: $localize`:@@gamemode.selfStudy.short:Učení vlastním tempem s výběrem otázek podle vybraného algoritmu`,
      longDescription: $localize`:@@gamemode.selfStudy.long: Účastníci postupují vlastním tempem. Systém jim adaptivně vybírá aktivity podle jejich
            úspěšnosti. Při častých chybách se více tyto aktivity častěji opakují, při úspěchu se
            méně opakují. Hostitel v reálném čase sleduje výsledky.`,
    },
  ];

  static readonly gameParameters: readonly GameSettingDefinition[] = [
    {
      key: 'roundTime',
      name: $localize`:@@setting.roundTime.name:Čas na kolo`,
      shortDescription: $localize`:@@setting.roundTime.short:Délka jednoho herního kola`,
      longDescription: $localize`:@@setting.roundTime.long:Určuje, jak dlouho trvá jedno kolo.`,
      type: 'number',
    },
    {
      key: 'selectionAlgorithm',
      name: $localize`:@@setting.selectionAlgorithm.name:Výběr otázek`,
      shortDescription: $localize`:@@setting.selectionAlgorithm.short:Algoritmus výběru otázek`,
      longDescription: $localize`:@@setting.selectionAlgorithm.long:Určuje způsob, jakým jsou vybírány otázky pro hráče.`,
      type: 'select',
      options: [
        {
          key: 'random',
          name: $localize`:@@setting.selectionAlgorithm.random.name:Náhodný`,
          shortDescription: $localize`:@@setting.selectionAlgorithm.random.short:Náhodný výběr otázek`,
          longDescription: '',
          icon: 'shuffle',
        },
        {
          key: 'bayesian',
          name: $localize`:@@setting.selectionAlgorithm.bayesian.name:Bayesian Knowledge Tracing`,
          shortDescription: $localize`:@@setting.selectionAlgorithm.bayesian.short:Adaptivní výběr aktivit podle znalostí`,
          longDescription: '',
          icon: 'model_training',
        },
        {
          key: 'thompson',
          name: $localize`:@@setting.selectionAlgorithm.thompson.name:Thompson Sampling`,
          shortDescription: $localize`:@@setting.selectionAlgorithm.thompson.short:Pravděpodobnostní výběr aktivit`,
          longDescription: '',
          icon: 'psychology',
        },
      ],
    },
    {
      key: 'scoringMode',
      name: $localize`:@@setting.scoringMode.name:Bodování`,
      shortDescription: $localize`:@@setting.scoringMode.short:Způsob výpočtu bodů`,
      longDescription: $localize`:@@setting.scoringMode.long:Nastavuje pravidla bodování ve hře.`,
      type: 'select',
      options: [
        {
          key: 'fast',
          name: $localize`:@@setting.scoringMode.fast.name:Rychlé odpovědi`,
          shortDescription: $localize`:@@setting.scoringMode.fast.short:Více bodů za rychlejší odpovídání`,
          longDescription: '',
          icon: 'bolt',
        },
        {
          key: 'balanced',
          name: $localize`:@@setting.scoringMode.balanced.name:Vyvážené`,
          shortDescription: $localize`:@@setting.scoringMode.balanced.short:Standardní bodování`,
          longDescription: '',
          icon: 'balance',
        },
      ],
    },
  ];

  static readonly respondTypes: readonly RespondTypeDefinition[] = [
    {
      key: 'individual',
      name: $localize`:@@respondType.individual.name:Individuální`,
      shortDescription: $localize`:@@respondType.individual.short:Každý účastník pracuje samostatně`,
      longDescription: $localize`:@@respondType.individual.long: Každý účastník pracuje samostatně a odpovídá na jednotlivé aktivity sám za sebe.
            Odpovědi nejsou sdílené a každý je vyhodnocen zvlášť.`,
      icon: 'person',
    },
    {
      key: 'team',
      name: $localize`:@@respondType.team.name:Týmový`,
      shortDescription: $localize`:@@respondType.team.short:Více účastníků spolupracuje v týmu`,
      longDescription: $localize`:@@respondType.team.long: Účastníci pracují ve skupinách, kde společně tvoří jednu společnou odpověď. Každý člen
            týmu může přidávat nebo upravovat rozpracovanou odpověď a sdílet její stav. Finální odpověď poté potvrzuje libovolný člen týmu.`,
      icon: 'groups',
    },
  ];

  static readonly sessionStatuses: readonly SessionStatusDefinition[] = [
    {
      key: 'finished',
      name: $localize`:@@status.finished:Ukončeno`,
    },
    {
      key: 'active',
      name: $localize`:@@status.active:Aktivní`,
    },
    {
      key: 'lobby',
      name: $localize`:@@status.lobby:Místnost`,
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

  static getGameMode(key: string): GameModeDefinition {
    const mode = this.gameModes.find((m) => m.key === key);

    if (!mode) {
      throw new Error(`Unknown game mode: ${key}`);
    }

    return mode;
  }

  static getSessionStatus(key: string): SessionStatusDefinition {
    const status = this.sessionStatuses.find((s) => s.key === key);

    if (!status) {
      throw new Error(`Unknown session status: ${key}`);
    }

    return status;
  }

  static getRespondType(key: string): RespondTypeDefinition {
    const respondType = this.respondTypes.find((s) => s.key === key);

    if (!respondType) {
      throw new Error(`Unknown respond type: ${key}`);
    }

    return respondType;
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

  static getHostComponent(key: string): Type<unknown> {
    const hostComponent = this.getGameMode(key).hostComponent;
    return hostComponent;
  }

  static getParticipantComponent(key: string): Type<unknown> {
    const participantComponent = this.getGameMode(key).participantComponent;
    return participantComponent;
  }

  static getCommands(): CommandUiDefinition[] {
    return this.commands;
  }
}
