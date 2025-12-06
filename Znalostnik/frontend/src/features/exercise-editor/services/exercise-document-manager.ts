import { Injectable, WritableSignal, computed, signal, inject } from '@angular/core';
import { ExerciseDocument } from '@shared/interfaces/exercise/exercise-document.interface';
import { Exercise, Task, Registry, HomeworkExercise } from '@shared/models/format';
import { EditorManager } from './editor-manager';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDocumentManager {
  editorService = inject(EditorManager);
  currentMode = computed(() => this.editorService.mode());

  exercise = signal<Exercise<any>>(new (Registry.getExercise(this.currentMode()))());

  addTask(task: Task): void {
    this.exercise().addTask(task);
  }

  addTaskAt(task: Task, index: number): void {
    this.exercise().addTaskAt(task, index);
  }

  createTask(schema: string): Task {
    const task = Registry.getTask(schema, this.currentMode())!;
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
