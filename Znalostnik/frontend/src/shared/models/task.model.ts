import { TaskBlockModel } from './task-block.model';

export interface TaskModel {
  id: string;
  documentSchema: string;
  taskBlocks: TaskBlockModel[];
}
