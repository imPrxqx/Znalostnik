import { FieldContext } from './field-context';

export interface Command {
  undo(): void;
  execute(): boolean;
}

export interface CommandUi {
  supports(field: FieldContext): boolean;
}

export interface MergeableCommand {
  canMergeWith(other: Command): boolean;
  mergeWith(other: Command): void;
}
