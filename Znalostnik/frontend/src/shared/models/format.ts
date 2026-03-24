import { Type, signal, WritableSignal } from '@angular/core';
import { UpdateMultiChoiceCommandUi } from '@shared/commands/components/update-multi-choice-command-ui/update-multi-choice-command-ui';
import { UpdateTextCommandUi } from '@shared/commands/components/update-text-command-ui/update-text-command-ui';
import { Quiz } from '@shared/templates/quiz/quiz';
import { sign } from 'crypto';

export interface Element {
  accept(visitor: Visitor): void;
}

export interface Visitor {
  visitQuiz(quizTask: QuizTask): void;
  visitExercise(exercise: Exercise): void;
}

export class Exercise implements Element {
  id = signal<string>(crypto.randomUUID());
  mode = signal<string>('interactive');
  title = signal<string>('exercise');
  tasks = signal<Task[]>([]);
  settings = signal<undefined>(undefined);

  deleteTask(task: Task): void {
    const currentTasks = [...this.tasks()];
    const index = currentTasks.indexOf(task);
    if (index !== -1) {
      currentTasks.splice(index, 1);
      this.tasks.set(currentTasks);
    }

    this.reindex();
  }

  deleteTaskById(taskId: string): void {
    const currentTasks = [...this.tasks()];
    const index = currentTasks.findIndex((task) => task.id() === taskId);
    if (index !== -1) {
      currentTasks.splice(index, 1);
      this.tasks.set(currentTasks);
    }

    this.reindex();
  }

  addTask(task: Task): void {
    const currentTasks = [...this.tasks()];
    currentTasks.push(task);
    this.tasks.set(currentTasks);

    this.reindex();
  }

  addTaskAt(task: Task, index: number): void {
    const currentTasks = [...this.tasks()];
    currentTasks.splice(index, 0, task);
    this.tasks.set(currentTasks);

    this.reindex();
  }

  move(index1: number, index2: number): void {
    const currentTasks = [...this.tasks()];

    const maxIndex = currentTasks.length - 1;
    if (index1 < 0 || index1 > maxIndex) {
      return;
    }
    if (index2 < 0) {
      index2 = 0;
    }
    if (index2 > maxIndex) {
      index2 = maxIndex;
    }

    const [taskToMove] = currentTasks.splice(index1, 1);

    currentTasks.splice(index2, 0, taskToMove);

    this.tasks.set(currentTasks);
    this.reindex();
  }

  getTasks(): WritableSignal<Task[]> {
    return this.tasks;
  }

  getTaskById(taskId: string): Task | undefined {
    return this.tasks().find((task) => task.id() === taskId);
  }

  getIndexOfTask(task: Task): number {
    return this.tasks().indexOf(task);
  }

  getTaskIndexById(taskId: string): number {
    return this.tasks().findIndex((task) => task.id() === taskId);
  }

  accept(visitor: Visitor): void {
    visitor.visitExercise(this);
  }

  private reindex() {
    this.tasks().map((task, index) => {
      task.order.set(index);
      return task;
    });
  }
}

export abstract class Task implements Element {
  id = signal(crypto.randomUUID());
  abstract order: WritableSignal<number>;
  abstract respondType: WritableSignal<string>;
  abstract gameMode: WritableSignal<string>;
  abstract type: WritableSignal<string>;
  abstract settings: WritableSignal<undefined>;

  abstract accept(visitor: Visitor): void;
}

export class QuizTask extends Task implements Element {
  type = signal<string>('quiz');
  order = signal<number>(0);
  respondType = signal<string>('individual');
  gameMode = signal<string>('classic');

  content = signal<Text>(new Text());
  options = signal<MultiChoiceOption>(new MultiChoiceOption());
  solution = signal<string[]>([]);
  settings = signal<undefined>(undefined);

  constructor(config?: any) {
    super();

    if (config?.id) {
      this.id.set(config.id);
    }

    if (config?.order) {
      this.order.set(config.order);
    }

    if (config?.respondType) {
      this.respondType.set(config.respondType);
    }

    if (config?.gameMode) {
      this.gameMode.set(config.gameMode);
    }

    if (config?.settings) {
      this.settings.set(config.settings);
    }

    if (config?.content) {
      const text = new Text();
      text.content = config.content;
      this.content.set(text);
    }

    if (config?.options) {
      const multiChoice = new MultiChoiceOption();
      multiChoice.options = [];
      config.options.forEach((opt: ChoiceOption) => {
        const option = new ChoiceOption();
        option.id = opt.id;
        option.content = opt.content;
        multiChoice.addOption(option);
      });
      this.options.set(multiChoice);
    }

    if (config?.solution) {
      this.solution.set(config.solution);
    }
  }

  setSolution(optionId: string) {
    const index = this.solution().findIndex((id) => id === optionId);
    if (index === -1) {
      this.solution().push(optionId);
    } else {
      this.solution().splice(index, 1);
    }
  }

  accept(visitor: Visitor): void {
    visitor.visitQuiz(this);
  }
}

export class ChoiceOption {
  id: string = crypto.randomUUID();
  content: string = 'Default Text';

  setContent(newContent: string) {
    this.content = newContent;
  }
}

export class MultiChoiceOption {
  options: ChoiceOption[] = [
    new ChoiceOption(),
    new ChoiceOption(),
    new ChoiceOption(),
    new ChoiceOption(),
  ];

  addOption(newOption: ChoiceOption) {
    this.options.push(newOption);
  }

  removeOption() {
    if (this.options.length === 0) {
      return;
    }
    this.options.pop();
  }
}

export class Text {
  content: string = 'Default Text';

  setContent(newContent: string) {
    this.content = newContent;
  }
}

export class Registry {
  static components: Record<string, any> = {
    quiz: Quiz,
  };

  static tasks: Record<string, any> = {
    quiz: QuizTask,
  };

  static commands: Type<any>[] = [UpdateTextCommandUi, UpdateMultiChoiceCommandUi];

  static createTask(key: any, config: any): Task {
    const TaskClass = this.tasks[key];
    return new TaskClass(config);
  }

  static getCommands(): any {
    return this.commands;
  }
}

export class ExerciseFactory {
  static createFromJson(json: any): Exercise {
    const exercise = new Exercise();
    exercise.id.set(json.id);
    exercise.settings.set(json.settings);

    json.tasks?.forEach((taskDef: any) => {
      const task = Registry.createTask(taskDef.type, taskDef.content);
      exercise.addTask(task);
    });

    return exercise;
  }
}

export class ExerciseTaskFactory {
  static createFromJson(json: any): Task {
    const task = Registry.createTask(json.type, json.content);
    return task;
  }
}

export class ExportJsonVisitor implements Visitor {
  private result: any = {};

  visitExercise(exercise: Exercise) {
    this.result = {
      title: exercise.title(),
      mode: exercise.mode(),
      settings: exercise.settings(),
      tasks: [],
    };

    exercise.tasks().forEach((task: Task, index: number) => {
      const taskVisitor = new ExportJsonVisitor();
      task.accept(taskVisitor);
      taskVisitor.result.order = taskVisitor.result.order ?? index;
      this.result.tasks.push(taskVisitor.result);
    });
  }

  visitQuiz(quizTask: QuizTask): void {
    this.result = {
      id: quizTask.id(),
      type: quizTask.type(),
      gameMode: quizTask.gameMode(),
      respondType: quizTask.respondType(),
      order: quizTask.order(),
      content: {
        content: quizTask.content().content,
        options: quizTask.options().options.map((option) => ({
          id: option.id,
          content: option.content,
        })),
        solution: quizTask.solution(),
        settings: quizTask.settings(),
      },
    };
  }

  toJson(): string {
    return JSON.stringify(this.result);
  }
}
