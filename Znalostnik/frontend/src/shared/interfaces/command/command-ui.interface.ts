import { Type } from '@angular/core';
import { InputSignal, OutputEmitterRef } from '@angular/core';

export interface CommandUI {
  receiver: InputSignal<any>;
  commandCreated: OutputEmitterRef<Command>;
}
