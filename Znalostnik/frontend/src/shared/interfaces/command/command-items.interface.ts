import { Type } from '@angular/core';
import { BaseBlockComponent } from '@shared/models/block-registry';
import { CommandUI } from '@shared/interfaces/command/command-ui.interface';

export interface CommandUIItem {
  component: Type<CommandUI>;
  receiver: BaseBlockComponent;
}
