import { Type } from '@angular/core';
import { InputSignal, OutputEmitterRef } from '@angular/core';
import { BaseBlockComponent } from '@shared/models/block-registry';

export interface CommandUI {
  receiver: InputSignal<any>;
  commandCreated: OutputEmitterRef<Command>;
}
