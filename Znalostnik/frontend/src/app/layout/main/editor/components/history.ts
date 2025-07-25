import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class History {
  private history: any[] = [];
  private currentIndex = -1;

  setSnapshot(state: any): void {
    console.log('History: setSnapshot', history);
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;
  }

  undo() {
    console.log('History: Undo', this.history);

    if (this.currentIndex >= 0) {
      this.currentIndex--;
    }
  }

  redo() {
    console.log('History: Redo', this.history);

    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
    }
  }

  getCurrent(): any | null {
    return this.history[this.currentIndex] ?? null;
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }
}
