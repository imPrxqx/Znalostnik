import { CommonModule } from '@angular/common';
import { Component, input, model, viewChild, ViewContainerRef } from '@angular/core';
import { Registry } from '@shared/models/registry';
import { Activity } from '@shared/models/activity';
import { ActivityAnswer } from '@shared/models/activity-answer';

@Component({
  selector: 'app-exercise-activity',
  imports: [CommonModule],
  templateUrl: './exercise-activity.html',
  styleUrl: './exercise-activity.scss',
})
export class ExerciseActivity {
  viewContainer = viewChild.required('activityContainer', {
    read: ViewContainerRef,
  });
  mode = input.required<string>();
  activity = input.required<Activity>();
  answer = model<ActivityAnswer | undefined>();

  ngOnChanges() {
    this.renderActivity();
  }

  renderActivity() {
    this.viewContainer().clear();

    const compRef = this.viewContainer().createComponent(
      Registry.getActivityComponent(this.activity().type()),
    );

    compRef.setInput('mode', this.mode());
    compRef.setInput('model', this.activity());
    compRef.setInput('answer', this.answer());
  }
}
