import { signal } from '@angular/core';
import { FieldContext } from '../interfaces/field-context';
import { randomWord, Activity } from './activity';
import { ActivityAnswer } from './activity-answer';
import { Element, Visitor } from '../interfaces/visitor';

export class GuessActivity extends Activity implements Element {
  type = signal<string>('guess');
  order = signal<number>(0);
  content = signal<Text>(new Text(undefined));
  solution = signal<TextSolution | undefined>(undefined);

  constructor(config?: any) {
    super(config);

    if (config?.id) {
      this.id.set(config.id);
    }

    if (config?.order) {
      this.order.set(config.order);
    }

    if (config?.content) {
      const text = new Text(config.content);
      this.content.set(text);
    }

    if (config?.solution) {
      const textSolution = new TextSolution();
      textSolution.correct = config.solution.correct;
      this.solution.set(textSolution);
    }
  }

  getFields(): FieldContext[] {
    return [
      {
        key: 'content',
        value: this.content(),
        signal: this.content,
        capabilities: ['edit-text'],
      },
      {
        key: 'solution',
        value: this.solution(),
        signal: this.solution,
        capabilities: ['edit-text-solution'],
      },
    ];
  }

  ensureSolution(): void {
    if (!this.solution()) {
      this.solution.set(new TextSolution());
    }
  }

  accept(visitor: Visitor): void {
    visitor.visitGuess(this);
  }
}

export class GuessAnswer extends ActivityAnswer {
  created = new Date().toLocaleString();
  submit: {
    selected: string;
  } = { selected: '' };

  correctPercentage: number = 0;

  status: string | undefined = undefined;
  constructor(config?: any) {
    super();

    if (config?.id) {
      this.id = config.id;
    }

    if (config?.version) {
      this.version = config.version;
    }

    if (config?.created) {
      this.created = config.created;
    }

    if (config?.submit) {
      this.submit = config.submit;

      if (this.submit.selected === undefined) {
        this.submit.selected = '';
      }
    }

    if (config?.status) {
      this.status = config.status;
    }

    if (config?.correctPercentage) {
      this.correctPercentage = config.correctPercentage;
    }

    if (config?.activityId) {
      this.activityId = config.activityId;
    }
  }
}

export class TextSolution {
  correct: string = randomWord();

  setSolution(newSolution: string) {
    this.correct = newSolution;
  }
}
