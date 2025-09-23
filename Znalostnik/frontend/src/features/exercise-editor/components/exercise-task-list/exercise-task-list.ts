import { Component, inject } from '@angular/core';
import { ExerciseDocumentManager } from '../../services/exercise-document-manager';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ExerciseTaskItemOverview } from '../exercise-task-item-overview/exercise-task-item-overview';

@Component({
  selector: 'app-exercise-task-list',
  imports: [ExerciseTaskItemOverview, CdkDropList, CdkDrag],
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
