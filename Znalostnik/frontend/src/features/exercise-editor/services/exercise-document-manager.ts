import { Injectable, WritableSignal, computed, signal, inject } from '@angular/core';
import { Exercise, Task, Registry } from '@shared/models/format';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocumentManager {
  exercise = signal<Exercise>(new Exercise());

  loadDocument(exercise: Exercise) {
    this.exercise.set(exercise);
  }

  addTask(task: Task): void {
    this.exercise().addTask(task);
  }

  addTaskAt(task: Task, index: number): void {
    this.exercise().addTaskAt(task, index);
  }

  createTask(schema: string): Task {
    const task = Registry.createTask(schema, undefined)!;
    return task;
  }

  duplicateTask(indexAt: number, indexTo: number): void {}

  move(index1: number, index2: number): void {
    this.exercise().move(index1, index2);
  }

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
}
