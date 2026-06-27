import { signal } from '@angular/core';
import { FieldContext } from '../interfaces/field-context';
import { MultiChoiceOption, ChoiceOption, Text } from './format';
import { Activity } from './activity';
import { ActivityAnswer } from './activity-answer';
import { Element, Visitor } from '../interfaces/visitor';

export type OrderedItem = {
  id: string;
};

export class PutInOrderActivity extends Activity implements Element {
  type = signal<string>('putInOrder');
  order = signal<number>(0);
  content = signal<Text>(new Text(undefined));
  options = signal<MultiChoiceOption>(new MultiChoiceOption());
  solution = signal<PutInOrderSolution | undefined>(undefined);

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

      const multiChoice = new MultiChoiceOption();
      multiChoice.options = [];
      config.content.options.forEach((opt: ChoiceOption) => {
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
    selected: Array<string>;
  } = { selected: [] };

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
