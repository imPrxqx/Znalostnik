import {
  Component,
  input,
  Input,
  Output,
  EventEmitter,
  signal,
  output,
  InputSignal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandUIItem } from '@shared/interfaces/command/command-items.interface';
import { TrueFalseBlockMetadata } from '@shared/interfaces/exercise/exercise-task-block-metadata.interface';
import { BaseBlockComponent } from '@shared/models/exercise-task-block-components.model';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise/exercise-task-block.interface';

@Component({
  selector: 'app-true-false-block',
  imports: [CommonModule],
  templateUrl: './true-false-block.html',
  styleUrl: './true-false-block.scss',
})
export class TrueFalseBlock implements BaseBlockComponent<TrueFalseBlockMetadata> {
  block = input.required<WritableSignal<ExerciseTaskBlock<TrueFalseBlockMetadata>>>();
  static readonly blockTemplate: string = 'trueFalse';
  @Input() exerciseId: string = '';
  @Input() editable: boolean = false;
  @Input() metadata: any;
  @Input() answered: any;

  @Output() changed = new EventEmitter<void>();
  @Output() answer = new EventEmitter<{ exerciseId: string; blockTemplate: string; answer: any }>();
  commandCreated = output<Command>();
  commandList = output<CommandUIItem[]>();

  selectedAnswer = signal<boolean | null>(null);

  ngOnInit() {
    console.log('Init true false');
    if (!this.metadata.hasOwnProperty('data')) {
      (this.metadata as any).data = {};
      (this.metadata as any).data.options = { true: 'True', false: 'False' };
    }

    if (this.editable && !this.metadata.hasOwnProperty('solution')) {
      (this.metadata as any).solution = {};
      (this.metadata as any).solution.answer = null;
    }

    if (this.answered && this.answered.hasOwnProperty('answers')) {
      const found = this.answered.answers.find(
        (a: any) =>
          a.exerciseId === this.exerciseId && a.blockTemplate === TrueFalseBlock.blockTemplate,
      );

      if (found) {
        this.selectedAnswer.set(found.answer);
      }
    }
  }

  getFeedbackClass(option: boolean): string {
    if (this.editable || !this.metadata?.feedback) {
      return '';
    }

    const correct: boolean[] = this.metadata.feedback.correct ?? [];
    const incorrect: boolean[] = this.metadata.feedback.incorrect ?? [];

    if (correct.includes(option)) {
      return 'correct';
    }

    if (incorrect.includes(option)) {
      return 'incorrect';
    }

    return '';
  }

  setAnswer(answer: boolean) {
    this.selectedAnswer.set(answer);

    this.answer.emit({
      exerciseId: this.exerciseId,
      blockTemplate: TrueFalseBlock.blockTemplate,
      answer: this.selectedAnswer(),
    });
  }

  setSolution(solution: boolean) {
    this.metadata.solution.answer = solution;
    this.changed.emit();
  }
}
