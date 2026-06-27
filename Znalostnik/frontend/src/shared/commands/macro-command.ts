export class MacroCommand implements Command {
  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  undo(): void {
    for (const command of this.commands.reverse()) {
      command.undo();
    }
  }

  execute(): boolean {
    for (const command of this.commands) {
      command.execute();
    }

    return true;
  }
}
