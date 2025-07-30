import { Injectable, signal } from '@angular/core';
import { DocumentSchemas } from './block-registry';

@Injectable({
  providedIn: 'root',
})
export class CentralEditor {
  document = signal<Record<string, any>>({ exercises: [] });
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

  selectExercise(id: string | null): void {
    const exercises = this.document()['exercises'] || [];

    if (id === null) {
      this.selectedExercise.set({});
      return;
    }

    const exercise = exercises.find((e: any) => e.id === id);

    if (exercise) {
      this.selectedExercise.set(exercise);
    } else if (exercises.length > 0) {
      this.selectedExercise.set(exercises[0]);
    } else {
      this.selectedExercise.set({});
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
    const currentExercise = this.selectedExercise();
    const currentExerciseId = currentExercise?.id;
    const currentSchema = currentExercise?.documentSchema;

    if (!currentExerciseId || currentSchema !== schema) {
      const newId = 'exercise-' + Math.random().toString(36).substring(2, 7);

      const blocks = DocumentSchemas[schema].requiredBody.map((groupKey: string) => {
        const section = DocumentSchemas[schema].bodyMeta[groupKey];
        const defaultTemplate = section.defaultTemplate;

        const localTemplate = groupKey === blockGroup ? template : defaultTemplate;

        return {
          blockSchema: groupKey,
          blockTemplate: localTemplate,
          metadata: {},
        };
      });

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
      this.setSnapshot();
      return;
    }

    this.document.update((doc) => {
      const updatedExercises = doc['exercises'].map((exercise: any) => {
        if (exercise.id !== currentExerciseId) {
          return exercise;
        }

        const targetBlock = exercise.blocks.find((block: any) => block.blockSchema === blockGroup);

        if (!targetBlock || targetBlock.blockTemplate === template) {
          return exercise;
        }

        const updatedBlocks = exercise.blocks.map((block: any) => {
          if (block.blockSchema === blockGroup) {
            return {
              ...block,
              blockTemplate: template,
              metadata: {},
            };
          }
          return block;
        });

        return {
          ...exercise,
          blocks: updatedBlocks,
        };
      });

      return {
        ...doc,
        exercises: updatedExercises,
      };
    });

    this.selectExercise(currentExerciseId);
    this.setSnapshot();
  }

  removeExercise(id: string) {
    this.document.update((document) => {
      const updated = { ...document };
      updated['exercises'] = updated['exercises'].filter((exercise: any) => exercise.id !== id);
      return updated;
    });

    this.selectExercise(this.document()['exercises'][0]?.id || null);
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
