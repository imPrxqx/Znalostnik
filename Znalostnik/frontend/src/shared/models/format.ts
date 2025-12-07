import { Type, OutputEmitterRef, InputSignal, signal, WritableSignal } from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { MultipleChoiceBlock } from '@shared/blocks/multiple-choice-block/multiple-choice-block';
import { UpdateTextCommandUi } from '@shared/commands/components/update-text-command-ui/update-text-command-ui';

export interface VisitorAccept {
  accept(visitor: Visitor): void;
}

export abstract class Exercise<T extends Task> implements VisitorAccept {
  id = signal<string>(crypto.randomUUID());
  abstract mode: WritableSignal<string>;
  tasks = signal<T[]>([]);

  accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }

  deleteTask(task: T): void {
    const currentTasks = this.tasks();
    const index = currentTasks.indexOf(task);
    if (index !== -1) {
      currentTasks.splice(index, 1);
      this.tasks.set(currentTasks);
    }
  }

  deleteTaskById(taskId: string): void {
    const currentTasks = this.tasks();
    const index = currentTasks.findIndex((task) => task.id() === taskId);
    if (index !== -1) {
      currentTasks.splice(index, 1);
      this.tasks.set(currentTasks);
    }
  }

  addTask(task: T): void {
    const currentTasks = [...this.tasks()];
    currentTasks.push(task);
    this.tasks.set(currentTasks);
  }

  addTaskAt(task: T, index: number): void {
    const currentTasks = [...this.tasks()];
    currentTasks.splice(index, 0, task);
    this.tasks.set(currentTasks);
  }

  getTasks(): WritableSignal<T[]> {
    return this.tasks;
  }

  getTaskById(taskId: string): T | undefined {
    return this.tasks().find((task) => task.id() === taskId);
  }

  getIndexOfTask(task: T): number {
    return this.tasks().indexOf(task);
  }

  getTaskIndexById(taskId: string): number {
    return this.tasks().findIndex((task) => task.id() === taskId);
  }
}

export class HomeworkExercise extends Exercise<HomeworkTask & Task> {
  mode = signal('homework');
}

export class TestExercise extends Exercise<TestTask & Task> {
  mode = signal('test');
}

export class InteractiveExercise extends Exercise<InteractiveTask & Task> {
  mode = signal('interactive');
  teacherViewData = signal<any>(null);
}

export interface InteractiveTask {
  __interactiveTask: true;
}

export interface HomeworkTask {
  __homeworkTask: true;
}

export interface TestTask {
  __testTask: true;
}

export abstract class Task implements VisitorAccept {
  id: WritableSignal<string>;
  abstract type: WritableSignal<string>;
  abstract formats: WritableSignal<Format[]>;
  abstract settings: WritableSignal<undefined>;

  constructor() {
    this.id = signal(crypto.randomUUID());
  }

  abstract accept(visitor: Visitor): void;
}

export abstract class QuizTask extends Task {
  type = signal<string>('quiz');

  question = signal<TextFormat>(new TextFormat());
  answer = signal<ChoiceFormat>(new ChoiceFormat());

  formats = signal<Format[]>([new TextFormat(), new ChoiceFormat()]);
  settings = signal<undefined>(undefined);

  override accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }
}

export class HomeworkQuiz extends QuizTask implements HomeworkTask {
  __homeworkTask: true = true;
}
export class InteractiveQuiz extends QuizTask implements InteractiveTask {
  __interactiveTask: true = true;
}
export class TestQuiz extends QuizTask implements TestTask {
  __testTask: true = true;
}

export class Puzzle extends Task {
  type = signal<string>('quiz');
  question = signal<ChoiceFormat>(new ChoiceFormat());
  formats = signal<Format[]>([]);
  settings = signal<undefined>(undefined);

  override accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }
}

export interface Visitor {
  visitExercise(exercise: Exercise<any>): void;
  visitQuiz(task: QuizTask): void;
  visitPuzzle(puzzle: Puzzle): void;
  visitChoiceFormat(choiceFormat: ChoiceFormat): void;
  visitTextFormat(textFormat: TextFormat): void;
}

export class JsonExportVisitor implements Visitor {
  visitExercise(exercise: Exercise<any>): void {
    throw new Error('Method not implemented.');
  }
  visitQuiz(task: QuizTask): void {
    throw new Error('Method not implemented.');
  }
  visitPuzzle(puzzle: Puzzle): void {
    throw new Error('Method not implemented.');
  }
  visitChoiceFormat(): void {
    throw new Error('Method not implemented.');
  }
  visitTextFormat(): void {
    throw new Error('Method not implemented.');
  }
}

export abstract class Response {
  abstract id: string;
  abstract taskId: string;
}

export class ChoiceResponse extends Response {
  id: string = crypto.randomUUID();
  taskId: string = crypto.randomUUID();
  answer = signal<number | undefined>(undefined);
  correct = signal<number | undefined>(undefined);
}

export abstract class Format implements VisitorAccept {
  id: WritableSignal<string>;
  abstract type: WritableSignal<string>;
  abstract component: WritableSignal<string>;

  constructor() {
    this.id = signal(crypto.randomUUID());
  }

  accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }
}

export class TextFormat extends Format {
  type = signal<string>('text');
  component = signal<string>('text');
  content = signal<string>('Text Content');

  override accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }

  getContent(): string {
    return this.content();
  }

  setContent(newContent: string) {
    this.content.set(newContent);
  }
}

export class ChoiceFormat extends Format {
  type = signal<'choice'>('choice');
  component = signal<'multichoice'>('multichoice');
  options = signal<ChoiceOption[]>([
    new ChoiceOption(),
    new ChoiceOption(),
    new ChoiceOption(),
    new ChoiceOption(),
  ]);
  solution = signal<string[] | undefined>(undefined);

  override accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }
}

export class ChoiceOption {
  id: string = crypto.randomUUID();
  content: string = 'Default Text';
}

export type ToolbarOutput<T extends Format> = {
  receiver: T;
  components: Type<CommandUiComponent<T>>[];
};

export interface CommandUiComponent<T extends Format> {
  format: InputSignal<T>;
  commands: OutputEmitterRef<Command>;
}

export interface ToolbarSupport<T extends Format> {
  getToolbarCommands(): ToolbarOutput<T>;
}

export interface FormatComponent<T extends Format> {
  viewMode: InputSignal<ViewModeType>;
  format: InputSignal<T>;
  actions: OutputEmitterRef<Action>;
}

export interface FormatComponentWithResponse<
  T extends Format,
  U extends Response,
> extends FormatComponent<T> {
  response: InputSignal<U | undefined>;
}

export interface Action {
  type: string;
  payload?: any;
}

export type ViewModeType = 'view' | 'edit';

export interface Focusable {
  onFocus(): void;
}

export interface FormatRule {
  index: number;
  allowed: Type<Format>[];
}

export interface TaskValidator {
  validate(task: Task): boolean;
}

type Mode = 'homework' | 'test';

interface ModeRegistryEntry<T> {
  [mode: string]: Type<T>;
}

export class Registry {
  static components = new Map<string, Type<FormatComponent<any>>>([
    ['text', TextBlock],
    ['multichoice', MultipleChoiceBlock],
  ]);

  static exercises: Record<string, Type<Exercise<any>>> = {
    interactive: InteractiveExercise,
    test: TestExercise,
    homework: HomeworkExercise,
  };

  static tasks: Record<string, ModeRegistryEntry<Task>> = {
    quiz: {
      homework: HomeworkQuiz,
      test: TestQuiz,
      interactive: InteractiveQuiz,
    },
  };

  static getExercise(key: string): Type<Exercise<any>> {
    const exercise = this.exercises[key];

    if (!exercise) {
      throw new Error(`Unknown exercise key: ${key}`);
    }

    return exercise;
  }

  static getTask(key: string, mode: string): Type<Task> {
    const entry = this.tasks[key];

    if (!entry) {
      throw new Error(`Unknown task key: ${key}`);
    }

    const taskClass = entry[mode];

    if (!taskClass) {
      throw new Error(`No task class for key "${key}" in mode "${mode}"`);
    }

    return taskClass;
  }

  static formats = new Map<string, Type<Format>>([
    ['text', TextFormat],
    ['choice', ChoiceFormat],
  ]);

  static commands = new Map<string, Type<CommandUiComponent<any>>>([
    ['update-text', UpdateTextCommandUi],
  ]);
}

export class DocumentBuilder {}

const homeworkExercise: Exercise<any> = new TestExercise();
homeworkExercise.addTask(new HomeworkQuiz());
homeworkExercise.addTask(new TestQuiz());
