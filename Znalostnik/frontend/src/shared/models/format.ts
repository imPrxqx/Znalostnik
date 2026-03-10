import { Type, signal, WritableSignal } from '@angular/core';
import { UpdateMultiChoiceCommandUi } from '@shared/commands/components/update-multi-choice-command-ui/update-multi-choice-command-ui';
import { UpdateTextCommandUi } from '@shared/commands/components/update-text-command-ui/update-text-command-ui';

import { Quiz } from '@shared/templates/quiz/quiz';

export class Exercise {
  id = signal<string>(crypto.randomUUID());
  tasks = signal<Task[]>([]);
  settings = signal<undefined>(undefined);

  deleteTask(task: Task): void {
    const currentTasks = [...this.tasks()];
    const index = currentTasks.indexOf(task);
    if (index !== -1) {
      currentTasks.splice(index, 1);
      this.tasks.set(currentTasks);
    }
  }

  deleteTaskById(taskId: string): void {
    const currentTasks = [...this.tasks()];
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
}

export abstract class Task {
  id = signal(crypto.randomUUID());
  abstract type: WritableSignal<string>;
  abstract settings: WritableSignal<undefined>;
}

export class QuizTask extends Task {
  type = signal<string>('quiz');

  styles = signal<string>('text');
  content = signal<Text>(new Text());
  options = signal<MultiChoiceOption>(new MultiChoiceOption());

  solution = signal<string[] | undefined>(undefined);
  settings = signal<undefined>(undefined);
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

  static getTask(key: string): Type<Task> {
    const entry = this.tasks[key];
    return entry;
  }

  static getCommands(): any {
    return this.commands;
  }
}
