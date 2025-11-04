import { Injectable, signal, ViewContainerRef, ViewChild } from '@angular/core';
import { CommandUIItem } from '@shared/interfaces/command/command-items.interface';
import { ToolbarOutput } from '@shared/models/format';

@Injectable({
  providedIn: 'root',
})
export class ToolbarManager {
  commands = signal<ToolbarOutput<any> | undefined>(undefined);

  setCommands(commands: ToolbarOutput<any>) {
    this.commands.set(commands);
  }

  clear() {
    this.commands.set(undefined);
  }
}
