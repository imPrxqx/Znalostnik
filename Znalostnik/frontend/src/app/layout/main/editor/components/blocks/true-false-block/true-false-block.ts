import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { BaseBlockComponent } from '../../block-registry';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-true-false-block',
  imports: [CommonModule],
  templateUrl: './true-false-block.html',
  styleUrl: './true-false-block.css',
})
export class TrueFalseBlock implements BaseBlockComponent {
  static readonly blockTemplate: string = 'trueFalse';
  @Input() exerciseId: string = '';
  @Input() editable: boolean = false;
  @Input() metadata: any;

  @Output() changed = new EventEmitter<void>();
  @Output() answer = new EventEmitter<{ exerciseId: string; blockTemplate: string; answer: any }>();

  selectedAnswer = signal<boolean | null>(null);

  ngOnInit() {
    if (!this.metadata.hasOwnProperty('data')) {
      (this.metadata as any).data = {};
      (this.metadata as any).data.options = { true: 'True', false: 'False' };
    }

    if (this.editable && !this.metadata.hasOwnProperty('solution')) {
      (this.metadata as any).solution = {};
      (this.metadata as any).solution.answer = null;
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
