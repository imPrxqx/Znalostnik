import { FieldContext } from './field-context';

/**
 * Represents a command that can be executed and reverted.
 */
export interface Command {
  undo(): void;
  execute(): boolean;
}

/**
 * Represents mergeable command
 */
export interface MergeableCommand {
  canMergeWith(other: Command): boolean;
  mergeWith(other: Command): void;
}
