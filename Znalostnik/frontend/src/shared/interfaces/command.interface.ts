interface Command {
  undo(): void;
  execute(): boolean;
}
