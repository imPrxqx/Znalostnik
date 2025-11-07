import { Type, OutputEmitterRef, InputSignal, signal, WritableSignal } from '@angular/core';
import { TextBlock } from '@shared/blocks/text-block/text-block';
import { MultipleChoiceBlock } from '@shared/blocks/multiple-choice-block/multiple-choice-block';
import { UpdateTextCommandUi } from '@shared/commands/components/update-text-command-ui/update-text-command-ui';

export interface ExerciseSetting {
  teamwork: boolean;
  timer: number;
}

export interface TaskSetting {
  points: number;
  timer: number;
}

export interface VisitorAccept {
  accept(visitor: Visitor): void;
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

export class Exercise implements VisitorAccept {
  id = signal<string>(crypto.randomUUID());
  mode = signal<string>('exercise');
  tasks = signal<Task[]>([]);

  accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }

  deleteTask(task: Task): void {
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

  addTask(task: Task): void {
    const currentTasks = [...this.tasks()];
    currentTasks.push(task);
    this.tasks.set(currentTasks);
  }

  addTaskAt(task: Task, index: number): void {
    const currentTasks = [...this.tasks()];
    currentTasks.splice(index, 0, task);
    this.tasks.set(currentTasks);
  }

  getTasks() {
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
}

export class HomeworkExercise extends Exercise {
  settings = signal<ExerciseSetting | undefined>(undefined);
  override mode = signal<string>('homework');
}

export class TestExercise extends Exercise {
  settings = signal<ExerciseSetting | undefined>(undefined);
  override mode = signal<string>('test');
}

export class OnlineExercise extends Exercise {
  settings = signal<ExerciseSetting | undefined>(undefined);
  override mode = signal<string>('online');
  // override tasks = signal<> asi by mel obsahovat jen interaktivni tasky
}

export abstract class Task implements VisitorAccept {
  id: WritableSignal<string>;
  abstract type: WritableSignal<string>;
  abstract formats: WritableSignal<Format[]>;
  abstract settings: WritableSignal<TaskSetting | undefined>;

  constructor() {
    this.id = signal(crypto.randomUUID());
  }

  abstract accept(visitor: Visitor): void;
}

export class Quiz extends Task {
  type = signal<string>('quiz');
  formats = signal<Format[]>([new TextFormat(), new ChoiceFormat()]);
  settings = signal<TaskSetting | undefined>(undefined);

  override accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }
}

export class Puzzle extends Task {
  type = signal<string>('quiz');
  formats = signal<Format[]>([]);
  settings = signal<TaskSetting | undefined>(undefined);

  override accept(visitor: Visitor): void {
    throw new Error('Method not implemented.');
  }
}

export interface Visitor {
  visitExercise(exercise: Exercise): void;
  visitQuiz(task: Quiz): void;
  visitPuzzle(puzzle: Puzzle): void;
  visitChoiceFormat(choiceFormat: ChoiceFormat): void;
  visitTextFormat(textFormat: TextFormat): void;
}

export class JsonExportVisitor implements Visitor {
  visitExercise(exercise: Exercise): void {
    throw new Error('Method not implemented.');
  }
  visitQuiz(task: Quiz): void {
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

export class ChoiceOption {
  id: string = crypto.randomUUID();
  content: string = 'Default Text';
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

export class ChoiceFormat extends Format {
  type = signal<string>('choice');
  component = signal<string>('multichoice');
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

export interface FormatComponentWithResponse<T extends Format, U extends Response>
  extends FormatComponent<T> {
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

export class Registry {
  static components = new Map<string, Type<FormatComponent<any>>>([
    ['text', TextBlock],
    ['multichoice', MultipleChoiceBlock],
  ]);

  static tasks = new Map<string, Type<Task>>([
    ['quiz', Quiz],
    ['puzzle', Puzzle],
  ]);

  static formats = new Map<string, Type<Format>>([
    ['text', TextFormat],
    ['choice', ChoiceFormat],
  ]);

  static commands = new Map<string, Type<CommandUiComponent<any>>>([
    ['update-text', UpdateTextCommandUi],
  ]);
}

export class DocumentBuilder {}
