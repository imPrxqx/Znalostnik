import { Component, ViewContainerRef, inject, input, OnChanges } from '@angular/core';
import { Registry } from '@shared/models/registry';
import { Activity } from '@shared/models/activity';

@Component({
  selector: 'app-exercise-toolbar',
  imports: [],
  templateUrl: './exercise-toolbar.html',
  styleUrl: './exercise-toolbar.scss',
})
export class ExerciseToolbar implements OnChanges {
  activity = input.required<Activity>();
  viewContainer = inject(ViewContainerRef);

  ngOnChanges() {
    this.renderCommands();
  }

  renderCommands(): void {
    this.viewContainer.clear();

    const fields = this.activity().getFields();
    const commands = Registry.getCommands();

    fields.forEach((field) => {
      commands.forEach((cmd) => {
        if (!cmd.supports?.(field)) {
          return;
        }

        const compRef = this.viewContainer.createComponent(cmd.component);
        compRef.setInput('field', field);
      });
    });
  }
}
