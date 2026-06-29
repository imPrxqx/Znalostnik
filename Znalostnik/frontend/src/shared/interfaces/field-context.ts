export interface FieldContext<T = unknown> {
  key: string;
  value: T;
  signal: T;
  capabilities: string[];
}
