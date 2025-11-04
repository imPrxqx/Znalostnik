import { Injectable, WritableSignal, signal } from '@angular/core';
import { ExerciseDocument } from '@shared/interfaces/exercise/exercise-document.interface';
import { Exercise, Task, Registry } from '@shared/models/format';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocumentManager {
  private exercise = signal<Exercise>(new Exercise());

  addTask(task: Task): void {
    this.exercise().addTask(task);
  }

  addTaskAt(task: Task, index: number): void {
    this.exercise().addTaskAt(task, index);
  }

  createTask(schema: string): Task {
    const task = Registry.tasks.get(schema)!;
    const newTask = new task();
    return newTask;
  }

  duplicateTask(indexAt: number, indexTo: number): void {}

  deleteTask(task: Task): void {
    this.exercise().deleteTask(task);
  }

  getTasks(): WritableSignal<Task[]> {
    return this.exercise().getTasks();
  }

  getTaskById(taskId: string): Task | undefined {
    return this.exercise().getTaskById(taskId);
  }

  deleteTaskById(taskId: string): void {
    this.exercise().deleteTaskById(taskId);
  }

  getIndexOfTask(task: Task): number {
    return this.exercise().getIndexOfTask(task);
  }

  getTaskIndexById(taskId: string): number {
    return this.exercise().getTaskIndexById(taskId);
  }

  setExerciseDocument(newDocument: ExerciseDocument, skipExerciseSnapshot: boolean = false): void {
    //this.exerciseDocument.set(newDocument);
  }
}
