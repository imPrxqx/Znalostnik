import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseBlockComponent } from '../../block-registry';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-true-false',
  imports: [CommonModule],
  templateUrl: './true-false.html',
  styleUrl: './true-false.css',
})
export class TrueFalse implements BaseBlockComponent {
  static readonly blockTemplate: string = 'trueFalse';
  @Input() exerciseId: string = '';
  @Input() editable: boolean = false;
  @Input() metadata: any;

  @Output() changed = new EventEmitter<void>();
  @Output() answer = new EventEmitter<{ exerciseId: string; blockTemplate: string; answer: any }>();

  selectedAnswer: boolean | null = null;

  ngOnInit() {
    if (!this.metadata.hasOwnProperty('data')) {
      (this.metadata as any).data = {};
      (this.metadata as any).data.options = { true: 'True', false: 'False' };
    }

    if (this.editable && !this.metadata.hasOwnProperty('solution')) {
      (this.metadata as any).solution = {};
      (this.metadata as any).solution.answer = null;
    }

    if (!this.editable) {
      this.answer.emit({
        exerciseId: this.exerciseId,
        blockTemplate: TrueFalse.blockTemplate,
        answer: this.selectedAnswer,
      });
    }
  }

  getFeedbackClass(option: boolean): string {
    console.log('called');

    if (this.editable || !this.metadata.hasOwnProperty('feedback')) {
      return '';
    }

    console.log('has feedback and is not editable');

    this.selectedAnswer = this.metadata.feedback.answer;
    const correct = this.metadata.feedback.correct;
    const selected = this.metadata.feedback.answer;

    if (correct === option) {
      return 'correct';
    }

    if (correct !== selected && option === selected) {
      return 'incorrect';
    }

    return '';
  }

  setAnswer(answer: boolean) {
    this.selectedAnswer = answer;

    this.answer.emit({
      exerciseId: this.exerciseId,
      blockTemplate: TrueFalse.blockTemplate,
      answer: this.selectedAnswer,
    });
  }

  setSolution(solution: boolean) {
    this.metadata.solution.answer = solution;
    this.changed.emit();
  }
}
