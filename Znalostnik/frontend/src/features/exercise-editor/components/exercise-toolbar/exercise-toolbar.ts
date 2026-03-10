import { Component, ViewChild, ViewContainerRef, effect, inject, input } from '@angular/core';
import { Task } from '@shared/models/format';
import { Registry } from '@shared/models/format';

@Component({
  selector: 'app-exercise-toolbar',
  imports: [],
  templateUrl: './exercise-toolbar.html',
  styleUrl: './exercise-toolbar.scss',
})
export class ExerciseToolbar {
  task = input<Task>();
  viewContainer = inject(ViewContainerRef);

  ngOnChanges() {
    this.renderCommands();
  }

  renderCommands(): void {
    this.viewContainer.clear();

    const suportedCommands = Registry.getCommands().filter(
      (cmd: any) => cmd.supports && cmd.supports(this.task()),
    );

    suportedCommands.forEach((cmd: any, index: number) => {
      const compRef = this.viewContainer.createComponent(cmd);
      compRef.setInput('task', this.task());

      if (index < suportedCommands.length - 1) {
        const br = document.createElement('br');
        compRef.location.nativeElement.appendChild(br);
      }
    });
  }
}
