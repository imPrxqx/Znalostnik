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

export interface QuizConfiguration {
  id: string;
  order: number;
  style: ActivityStyle;
  content: {
    text: string;
    style: TextStyle;
    options: ChoiceOptionConfiguration[];
  };
  solution: QuizSolution;
}

export interface QuizAnswerConfiguration {
  id: string;
  createdAt: string;
  correctPercentage: number;
  status: string | undefined;
  version: number;
  submit: {
    selected: string[];
  };
  activityId: string;
  submissionId: string;
}

/**
 * Represents data structure of quiz activity.
 */
export class QuizActivity extends Activity implements Element {
  type = signal<string>('quiz');
  order = signal<number>(0);
  content = signal<Text>(new Text(undefined));
  options = signal<MultiChoiceOption>(new MultiChoiceOption());
  solution = signal<QuizSolution | undefined>(undefined);

  constructor(config?: QuizConfiguration) {
    super();

    console.log(config);

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
        multiChoice.addOption(option);
      });

      this.options.set(multiChoice);
    }

    if (config?.solution) {
      const multiChoiceSolution = new QuizSolution();
      multiChoiceSolution.correct = config.solution.correct;

      this.solution.set(multiChoiceSolution);
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
        key: 'choices',
        value: {
          choices: this.options(),
          solution: this.solution(),
        },
        signal: {
          choices: this.options,
          solution: this.solution,
        },
        capabilities: ['edit-choices'],
      },
    ];
  }

  ensureSolution(): void {
    if (!this.solution()) {
      this.solution.set(new QuizSolution());
    }
  }

  accept(visitor: Visitor): void {
    visitor.visitQuiz(this);
  }
}

/**
 * Represents data structure of quiz answer.
 */
export class QuizAnswer extends ActivityAnswer {
  createdAt = new Date().toLocaleString();
  submit: {
    selected: string[];
  } = { selected: [] };
  correctPercentage = 0;
  status: string | undefined = undefined;

  constructor(config: QuizAnswerConfiguration) {
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

/**
 * Represents data structure of quiz solution.
 */
export class QuizSolution {
  correct: string[] = [];

  setSolution(optionId: string) {
    const index = this.correct.findIndex((id) => id === optionId);
    if (index === -1) {
      this.correct.push(optionId);
    } else {
      this.correct.splice(index, 1);
    }
  }
}
