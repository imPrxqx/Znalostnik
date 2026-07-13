import { ClassicHost } from '@features/session/modes/classic/classic-host/classic-host';
import { HotPotatoHost } from '@features/session/modes/hot-potato/hot-potato-host/hot-potato-host';
import { SelfStudyHost } from '@features/session/modes/self-study/self-study-host/self-study-host';
import { ClassicParticipant } from '@features/session/modes/classic/classic-participant/classic-participant';
import { HotPotatoParticipant } from '@features/session/modes/hot-potato/hot-potato-participant/hot-potato-participant';
import { SelfStudyParticipant } from '@features/session/modes/self-study/self-study-participant/self-study-participant';
import { GameSetting } from '../models/session';
import { Type } from '@angular/core';

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

export class RegistrySession {
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
          shortDescription: $localize`:@@setting.selectionAlgorithm.thompson.short:Adaptivní výběr aktivit podle úspěšnosti`,
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

  static getHostComponent(key: string): Type<unknown> {
    const hostComponent = this.getGameMode(key).hostComponent;
    return hostComponent;
  }

  static getParticipantComponent(key: string): Type<unknown> {
    const participantComponent = this.getGameMode(key).participantComponent;
    return participantComponent;
  }
}
