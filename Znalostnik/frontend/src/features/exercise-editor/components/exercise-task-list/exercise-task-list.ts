import { Component, inject } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { ExerciseTaskItem } from '../exercise-task-item/exercise-task-item';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-exercise-task-list',
  imports: [ExerciseTaskItem, CdkDropList, CdkDrag],
  templateUrl: './exercise-task-list.html',
  styleUrl: './exercise-task-list.css',
})
export class ExerciseTaskList {
  protected exerciseDocumentService: ExerciseDocumentManager = inject(ExerciseDocumentManager);

  protected changeOrder(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.exerciseDocumentService.getExerciseTasks()(),
      event.previousIndex,
      event.currentIndex,
    );
  }
}
