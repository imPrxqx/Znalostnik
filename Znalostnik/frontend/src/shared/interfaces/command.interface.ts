interface Command {
  undo(): void;
  execute(): boolean;
}

interface MergeableCommand {
  canMergeWith(other: Command): boolean;
  mergeWith(other: Command): void;
}
