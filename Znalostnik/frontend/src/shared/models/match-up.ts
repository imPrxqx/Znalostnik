import { signal } from '@angular/core';
import { FieldContext } from '../interfaces/field-context';
import {
  MultiChoiceOption,
  ChoiceOption,
  Text,
  ChoiceOptionConfiguration,
  TextConfiguration,
  TextStyle,
} from './blocks';
import { Activity, ActivityStyle } from './activity';
import { ActivityAnswer } from './activity-answer';
import { Element, Visitor } from '../interfaces/visitor';

export interface MatchUpConfiguration {
  id: string;
  order: number;
  style: ActivityStyle;
  content: {
    text: string;
    style: TextStyle;
    leftOptions: ChoiceOptionConfiguration[];
    rightOptions: ChoiceOptionConfiguration[];
  };
  solution: MatchUpSolution;
}

export interface MatchUpAnswerConfiguration {
  id: string;
  createdAt: string;
  correctPercentage: number;
  status: string | undefined;
  version: number;
  submit: {
    selected: PairItem[];
  };
  activityId: string;
  submissionId: string;
}

export interface PairItem {
  leftId: string;
  rightId: string;
}

export class MatchUpActivity extends Activity implements Element {
  type = signal<string>('matchUp');
  order = signal<number>(0);
  content = signal<Text>(new Text(undefined));
  leftOptions = signal<MultiChoiceOption>(new MultiChoiceOption());
  rightOptions = signal<MultiChoiceOption>(new MultiChoiceOption());
  solution = signal<MatchUpSolution | undefined>(undefined);

  constructor(config?: MatchUpConfiguration) {
    super();

    if (config?.id) {
      this.id.set(config.id);
    }

    if (config?.order) {
      this.order.set(config.order);
    }

    if (config?.style) {
      const style = new ActivityStyle();

      if (config?.style?.borderRadius) {
        style.borderRadius = config?.style.borderRadius;
      }

      if (config?.style?.borderColor) {
        style.borderColor = config?.style.borderColor;
      }

      if (config?.style?.backgroundColor) {
        style.backgroundColor = config?.style.backgroundColor;
      }

      this.style.set(style);
    }

    if (config?.content) {
      const textConfiguration: TextConfiguration = {
        text: config.content.text,
        style: config.content.style,
      };

      const text = new Text(textConfiguration);
      this.content.set(text);

      const multiChoiceLeft = new MultiChoiceOption();
      multiChoiceLeft.options = [];

      config.content.leftOptions.forEach((opt) => {
        const option = new ChoiceOption(opt);
        multiChoiceLeft.addOption(option);
      });

      multiChoiceLeft.options.sort(() => Math.random() - 0.5);
      this.leftOptions.set(multiChoiceLeft);

      const multiChoiceRight = new MultiChoiceOption();
      multiChoiceRight.options = [];

      config.content.rightOptions.forEach((opt) => {
        const option = new ChoiceOption(opt);
        multiChoiceRight.addOption(option);
      });

      multiChoiceRight.options.sort(() => Math.random() - 0.5);
      this.rightOptions.set(multiChoiceRight);
    }

    if (config?.solution) {
      const solution = new MatchUpSolution();
      solution.correct = config.solution.correct;
      this.solution.set(solution);
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
        key: 'match-up-choices',
        value: {
          leftOptions: this.leftOptions(),
          rightOptions: this.rightOptions(),
          solution: this.solution(),
        },
        signal: {
          leftOptions: this.leftOptions,
          rightOptions: this.rightOptions,
          solution: this.solution,
        },
        capabilities: ['edit-match-up-choices'],
      },
    ];
  }

  ensureSolution(): void {
    if (!this.solution()) {
      this.solution.set(new MatchUpSolution());

      const left = this.leftOptions().options;
      const right = this.rightOptions().options;
      const pairs = Math.min(left.length, right.length);

      for (let i = 0; i < pairs; i++) {
        this.solution()?.correct.push({
          leftId: left[i].id,
          rightId: right[i].id,
        });
      }
    }
  }

  accept(visitor: Visitor): void {
    visitor.visitMatchUp(this);
  }
}

export class MatchUpAnswer extends ActivityAnswer {
  createdAt = new Date().toLocaleString();
  submit: {
    selected: PairItem[];
  } = { selected: [] };
  correctPercentage = 0;
  status: string | undefined = undefined;
  constructor(config?: MatchUpAnswerConfiguration) {
    super();

    if (config?.id) {
      this.id = config.id;
    }

    if (config?.version) {
      this.version = config.version;
    }

    if (config?.createdAt) {
      this.createdAt = config.createdAt;
    }

    if (config?.submit) {
      this.submit = config.submit;

      if (this.submit.selected == undefined) {
        this.submit.selected = [];
      }
    }

    if (config?.correctPercentage) {
      this.correctPercentage = config.correctPercentage;
    }

    if (config?.status) {
      this.status = config.status;
    }

    if (config?.activityId) {
      this.activityId = config.activityId;
    }

    if (config?.submissionId) {
      this.submissionId = config.submissionId;
    }
  }
}

export class MatchUpSolution {
  correct: PairItem[] = [];

  move(fromIndex: number, toIndex: number, position: 'left' | 'right') {
    const updated = this.correct.map((item) => ({ ...item }));

    const from = updated[fromIndex];
    const to = updated[toIndex];

    if (!from || !to) {
      return;
    }

    if (position === 'left') {
      const temp = from.leftId;
      from.leftId = to.leftId;
      to.leftId = temp;
    }

    if (position === 'right') {
      const temp = from.rightId;
      from.rightId = to.rightId;
      to.rightId = temp;
    }

    this.correct = updated;
  }

  setSolution(pairs: PairItem[]) {
    this.correct = pairs;
  }
}
