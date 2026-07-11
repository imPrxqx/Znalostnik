import { signal, WritableSignal } from '@angular/core';
import { FieldContext } from '../interfaces/field-context';
import { Visitor, Element } from '../interfaces/visitor';
import { v4 as uuidv4 } from 'uuid';
import { Signal } from '@angular/core';
import { ActivityAnswer } from './activity-answer';

export type ActivityMode = 'view' | 'answering' | 'feedback';

export interface ActivityComponent {
  mode: Signal<ActivityMode>;
  model: Signal<Activity>;
  answer: Signal<ActivityAnswer | undefined>;
}

export interface ActivityConfiguration {
  id: string;
  style: ActivityStyle;
  order: number;
  type: string;
}

export class ActivityStyle {
  borderRadius = 8;
  borderColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 30%)`;
  backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 85%)`;
}

export abstract class Activity implements Element {
  id = signal(uuidv4());
  style = signal(new ActivityStyle());
  abstract order: WritableSignal<number>;
  abstract type: WritableSignal<string>;
  abstract accept(visitor: Visitor): void;
  abstract getFields(): FieldContext[];
  abstract ensureSolution(): void;

  setStyle(newStyle: ActivityStyle) {
    this.style.set(newStyle);
  }
}

const data = {
  questions: [
    $localize`:@@rainQuestion:Proč padá déšť?`,
    $localize`:@@sunQuestion:Proč svítí slunce?`,
    $localize`:@@brainQuestion:Jak se učí mozek?`,
    $localize`:@@carQuestion:Jak běží auto?`,
    $localize`:@@dayNightQuestion:Proč je noc a den?`,
    $localize`:@@treeQuestion:Jak roste strom?`,
    $localize`:@@planeQuestion:Proč létají letadla?`,
    $localize`:@@rainbowQuestion:Jak vzniká duha?`,
    $localize`:@@computerQuestion:Jak funguje počítač?`,
    $localize`:@@waterQuestion:Proč teče voda z kopce?`,
    $localize`:@@cloudQuestion:Jak se tvoří mraky?`,
    $localize`:@@soundQuestion:Proč slyšíme zvuk?`,
    $localize`:@@heartQuestion:Jak funguje srdce?`,
  ] as string[],

  words: [
    $localize`:@@rain:déšť`,
    $localize`:@@magnet:magnet`,
    $localize`:@@sun:slunce`,
    $localize`:@@brain:mozek`,
    $localize`:@@car:auto`,
    $localize`:@@day:den`,
    $localize`:@@tree:strom`,
    $localize`:@@phone:telefon`,
    $localize`:@@plane:letadlo`,
    $localize`:@@rainbow:duha`,
    $localize`:@@computer:počítač`,
    $localize`:@@water:voda`,
    $localize`:@@clouds:mraky`,
    $localize`:@@sound:zvuk`,
    $localize`:@@heart:srdce`,
  ] as string[],
} as const;

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomQuestion(): string {
  return random(data.questions);
}

export function randomWord(): string {
  return random(data.words);
}
