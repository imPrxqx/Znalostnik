import { Type } from '@angular/core';
import { BaseBlockComponent } from '@shared/models/exercise-task-block-components.model';
import { CommandUI } from '@shared/interfaces/command/command-ui.interface';

export interface CommandUIItem {
  component: Type<CommandUI>;
  receiver: BaseBlockComponent<any>;
}
