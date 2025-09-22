import { Type } from '@angular/core';
import { BaseBlockComponent } from '@shared/models/block-registry';
import { CommandUI } from './command-ui.interface';

export interface CommandUIItem {
  component: Type<CommandUI>;
  receiver: BaseBlockComponent;
}
