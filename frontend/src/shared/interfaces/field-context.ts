/**
 * Used for defining which commands can be merged with each other commands
 */
export interface FieldContext<T = unknown> {
  key: string;
  value: T;
  signal: T;
  capabilities: string[];
}
