import { Injectable, signal, ViewContainerRef, ViewChild } from '@angular/core';
import { CommandUIItem } from '@shared/interfaces/command-items.interface';

@Injectable({
  providedIn: 'root',
})
export class ToolbarManager {
  commands = signal<CommandUIItem[]>([]);

  setCommands(commands: CommandUIItem[]) {
    this.commands.set(commands);
  }

  clear() {
    this.commands.set([]);
  }
}
