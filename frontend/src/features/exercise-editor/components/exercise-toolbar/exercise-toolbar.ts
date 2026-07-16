import { Component, ViewContainerRef, inject, input, OnChanges } from '@angular/core';
import { RegistryActivity } from '@shared/registry/registry-activity';
import { Activity } from '@shared/models/activity';

/**
 * Dynamically displays editing commands based on
 * the fields supported by the selected activity.
 */
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
    const commands = RegistryActivity.getCommands();

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
