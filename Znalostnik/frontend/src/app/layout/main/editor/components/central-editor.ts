import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CentralEditor {
  document = signal<Record<string, any>>({});
  selectedExercise = signal<any>({});
  private history: any[] = [];
  private currentIndex = 0;

  constructor() {}

  setSnapshot(state: any): void {
    console.log('History: setSnapshot', history);
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;
  }

  undo() {
    console.log('History: Undo', this.history);

    if (this.currentIndex > 0) {
      this.currentIndex--;

      console.log('Redo to index:', this.history[this.currentIndex][1]);
      console.log('Redo to index:', this.history[this.currentIndex][0]);

      this.document.set(this.history[this.currentIndex][1] || {});
      this.selectedExercise.set(this.history[this.currentIndex][0] || {});
    }
  }

  redo() {
    console.log('History: Redo', this.history);

    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      console.log('Redo to index:', this.history[this.currentIndex][1]);
      console.log('Redo to index:', this.history[this.currentIndex][0]);

      this.document.set(this.history[this.currentIndex][1] || {});
      this.selectedExercise.set(this.history[this.currentIndex][0] || {});
    }
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.document.set({});
    this.selectedExercise.set({});
  }

  setExerciseBlock(id: string, block: any) {
    this.document.update((document) => ({
      ...document,
      [id]: block,
    }));

    this.setSnapshot([this.selectedExercise(), this.document()]);
  }

  removeExerciseBlock(id: string) {
    this.document.update((document) => {
      const updated = { ...document };
      delete updated[id];
      return updated;
    });

    this.setSnapshot([this.selectedExercise(), this.document()]);
  }

  getJson(): string {
    return JSON.stringify(this.document());
  }

  loadFromJson(json: string): void {
    try {
      const parsed = JSON.parse(json);
      this.document.set(parsed || {});
      this.selectedExercise.set(this.document()['exercises'][0] || []);
      this.setSnapshot([this.selectedExercise(), this.document()]);
      this.currentIndex = this.history.length - 1;
    } catch {
      console.error('Invalid JSON');
    }
  }
}
