import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommandHistory {
  history: Command[] = [];

  push(command: Command) {
    this.history.push(command);
  }

  pop() {
    return this.history.pop();
  }
}
