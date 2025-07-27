import { Injectable, signal } from '@angular/core';
import { DocumentSchemas } from './block-registry';

@Injectable({
  providedIn: 'root',
})
export class CentralEditor {
  document = signal<Record<string, any>>({ exercises: [], solutions: [] });
  selectedExercise = signal<any>({});
  private history: any[] = [];
  private currentIndex = -1;

  constructor() {}

  setSnapshot(): void {
    console.log('History before slice', this.history);

    this.history = this.history.slice(0, this.currentIndex + 1);
    console.log('History after slice', this.history);

    const snapshotCopy = structuredClone([this.selectedExercise()['id'], this.document()]);
    this.history.push(snapshotCopy);

    console.log('Index before loading:', this.currentIndex);
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }

    console.log('History: setSnapshot', this.history);
  }

  selectExercise(id: string): void {
    const exercise = this.document()['exercises']?.find((e: any) => e.id === id);
    if (exercise) {
      this.selectedExercise.set(exercise);
    } else {
      console.warn(`Exercise with id ${id} not found`);
    }
  }

  undo() {
    console.log('Index before undo:', this.currentIndex);
    if (this.currentIndex > 0) {
      this.currentIndex--;

      console.log('Undo to index:', this.history[this.currentIndex][1], this.currentIndex);
      console.log('Undo to index:', this.history[this.currentIndex][0], this.currentIndex);

      const snapshot = this.history[this.currentIndex];
      this.document.set(structuredClone(snapshot[1]));
      this.selectExercise(snapshot[0]);
    }
  }

  redo() {
    console.log('Index before redo:', this.currentIndex);

    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      console.log('Redo to index:', this.history[this.currentIndex][1], this.currentIndex);
      console.log('Redo to index:', this.history[this.currentIndex][0], this.currentIndex);

      const snapshot = this.history[this.currentIndex];
      this.document.set(structuredClone(snapshot[1]));
      this.selectExercise(snapshot[0]);
    }
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.document.set({});
    this.selectedExercise.set({});
  }

  setExerciseBlock(schema: string, blockGroup: string, template: string) {
    if (this.selectedExercise()['id'] === undefined) {
      console.error('Exercise is not initialized');

      const newId = 'exercise-' + Math.random().toString(36).substring(2, 7);
      const blocks = DocumentSchemas[schema].requiredBody.map((type: string) => ({
        blockSchema: type,
        blockTemplate: template, // TODO: get default template from schema
      }));

      const newExercise = {
        id: newId,
        documentSchema: schema,
        blocks,
      };

      this.document.update((document) => ({
        ...document,
        exercises: [...(document['exercises'] || []), newExercise],
      }));

      this.selectedExercise.set(newExercise);
    }

    this.document.update((document) => ({
      ...document,
      [this.selectedExercise()['id']]: template,
    }));

    this.setSnapshot();
  }

  removeExerciseBlock(id: string) {
    this.document.update((document) => {
      const updated = { ...document };
      delete updated[id];
      return updated;
    });

    this.setSnapshot();
  }

  getJson(): string {
    return JSON.stringify(this.document());
  }

  loadFromJson(json: string): void {
    try {
      const parsed = JSON.parse(json);
      this.document.set(parsed || {});
      this.selectedExercise.set(this.document()['exercises'][0] || []);
      this.setSnapshot();

      console.log('History after loading:', this.history);
    } catch {
      console.error('Invalid JSON');
    }
  }
}
