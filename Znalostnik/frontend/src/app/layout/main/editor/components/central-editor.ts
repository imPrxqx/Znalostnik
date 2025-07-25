import { Injectable, signal } from '@angular/core';
import { History } from './history';

@Injectable({
  providedIn: 'root',
})
export class CentralEditor {
  document = signal<Record<string, any>>({});
  selectedExercise = signal<any>({});

  constructor(private historyService: History) {}

  setExerciseBlock(id: string, block: any) {
    this.document.update((document) => ({
      ...document,
      [id]: block,
    }));

    this.historyService.setSnapshot(this.document());
  }

  removeExerciseBlock(id: string) {
    this.document.update((document) => {
      const updated = { ...document };
      delete updated[id];
      return updated;
    });

    this.historyService.setSnapshot(this.document());
  }

  getJson(): string {
    return JSON.stringify(this.document());
  }

  loadFromJson(json: string): void {
    try {
      const parsed = JSON.parse(json);
      this.document.set(parsed || {});
      this.selectedExercise.set(this.document()['exercises'][0] || []);
    } catch {
      console.error('Invalid JSON');
    }
  }
}
