import { signal } from '@angular/core';
import { FieldContext } from '../interfaces/field-context';
import {
  MultiChoiceOption,
  ChoiceOption,
  Text,
  ChoiceOptionConfiguration,
  TextConfiguration,
  TextStyle,
} from './format';
import { Activity, ActivityStyle } from './activity';
import { ActivityAnswer } from './activity-answer';
import { Element, Visitor } from '../interfaces/visitor';

export interface OrderedItem {
  id: string;
}

export interface PutInOrderConfiguration {
  id: string;
  order: number;
  style: ActivityStyle;
  content: {
    text: string;
    style: TextStyle;
    options: ChoiceOptionConfiguration[];
  };
  solution: PutInOrderSolution;
}

export interface PutInOrderAnswerConfiguration {
  id: string;
  created: string;
  correctPercentage: number;
  status: string | undefined;
  version: number;
  submit: {
    selected: string[];
  };
  activityId: string;
}

export class PutInOrderActivity extends Activity implements Element {
  type = signal<string>('putInOrder');
  order = signal<number>(0);
  content = signal<Text>(new Text(undefined));
  options = signal<MultiChoiceOption>(new MultiChoiceOption());
  solution = signal<PutInOrderSolution | undefined>(undefined);

  constructor(config?: PutInOrderConfiguration) {
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

      const multiChoice = new MultiChoiceOption();
      multiChoice.options = [];
      config.content.options.forEach((opt) => {
        const option = new ChoiceOption(opt);
        multiChoice.options.push(option);
      });
      multiChoice.options.sort(() => Math.random() - 0.5);

      this.options.set(multiChoice);
    }

    if (config?.solution) {
      const solution = new PutInOrderSolution();
      solution.correct = config.solution.correct;

      this.solution.set(solution);
    }
  }

  ensureSolution() {
    if (!this.solution()) {
      this.solution.set(new PutInOrderSolution());

      this.options().options.forEach((option) => {
        this.solution()?.setSolution(option.id);
      });
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
        key: 'put-in-order-choices',
        value: {
          choices: this.options(),
          solution: this.solution(),
        },
        signal: {
          choices: this.options,
          solution: this.solution,
        },
        capabilities: ['edit-put-in-order'],
      },
    ];
  }

  accept(visitor: Visitor): void {
    visitor.visitPutInOrder(this);
  }
}

export class PutInOrderAnswer extends ActivityAnswer {
  created = new Date().toLocaleString();
  submit: {
    selected: string[];
  } = { selected: [] };

  correctPercentage = 0;
  status: string | undefined = undefined;

  constructor(config?: PutInOrderAnswerConfiguration) {
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
  }
}

export class PutInOrderSolution {
  correct: string[] = [];

  setSolution(optionId: string) {
    const index = this.correct.findIndex((id) => id === optionId);
    if (index === -1) {
      this.correct.push(optionId);
    } else {
      this.correct.splice(index, 1);
    }
  }

  move(fromIndex: number, toIndex: number) {
    const updated = [...this.correct];
    const [item] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, item);

    this.correct = updated;
  }
}
