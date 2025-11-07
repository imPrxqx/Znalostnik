import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EditorManager {
  mode = signal<string>('online');

  setMode(mode: string) {
    this.mode.set(mode);
  }
}
