import { Injectable } from '@angular/core';
import { Command } from '@shared/interfaces/command.interface';

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
