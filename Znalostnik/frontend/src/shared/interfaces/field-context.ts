export interface FieldContext<T = any> {
  key: string;
  value: T;
  signal: any;
  capabilities: string[];
}
