import { Component } from '@angular/core';
import { CentralEditor } from '../central-editor';
@Component({
  selector: 'app-list-exercises',
  imports: [],
  templateUrl: './list-exercises.html',
  styleUrl: './list-exercises.css',
})
export class ListExercises {
  constructor(private centralEditorService: CentralEditor) {}

  get exercises() {
    return this.centralEditorService.document()['exercises'] || [];
  }
}
