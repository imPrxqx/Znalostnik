import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
  signal,
} from '@angular/core';
import { BaseBlockComponent } from '../../block-registry';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiple-choice-block',
  imports: [CommonModule, FormsModule],
  templateUrl: './multiple-choice-block.html',
  styleUrl: './multiple-choice-block.css',
})
export class MultipleChoiceBlock implements BaseBlockComponent {
  static readonly blockTemplate: string = 'multipleChoice';
  @Input() exerciseId: string = '';
  @Input() metadata: any;
  @Input() editable: boolean = false;
  @Output() changed = new EventEmitter<void>();
  @Output() answer = new EventEmitter<{ exerciseId: string; blockTemplate: string; answer: any }>();

  isEditing = false;
  @ViewChildren('editable') editableRefs!: QueryList<ElementRef>;
  selectedAnswers = signal<string[]>([]);

  ngOnInit() {
    if (!this.metadata.hasOwnProperty('data')) {
      (this.metadata as any).data = {};

      (this.metadata as any).data.options = [
        { id: Math.random().toString(36).substring(2, 9), text: 'Odpoved 1' },
        { id: Math.random().toString(36).substring(2, 9), text: 'Odpoved 2' },
        { id: Math.random().toString(36).substring(2, 9), text: 'Odpoved 3' },
        { id: Math.random().toString(36).substring(2, 9), text: 'Odpoved 4' },
      ];
    }

    if (this.editable && !this.metadata.hasOwnProperty('solution')) {
      (this.metadata as any).solution = {};
      (this.metadata as any).solution.answer = [];
    }
  }

  setAnswer(optionId: string) {
    const current = [...this.selectedAnswers()];
    const index = current.indexOf(optionId);

    if (index === -1) {
      current.push(optionId);
    } else {
      current.splice(index, 1);
    }

    this.selectedAnswers.set(current);

    this.answer.emit({
      exerciseId: this.exerciseId,
      blockTemplate: MultipleChoiceBlock.blockTemplate,
      answer: this.selectedAnswers(),
    });
  }

  getFeedbackClass(option: string): string {
    if (this.editable || !this.metadata?.feedback) {
      return '';
    }

    const correct: string[] = this.metadata.feedback.correct ?? [];
    const incorrect: string[] = this.metadata.feedback.incorrect ?? [];

    if (correct.includes(option)) {
      return 'correct';
    }

    if (incorrect.includes(option)) {
      return 'incorrect';
    }

    return '';
  }

  isOptionCorrect(optionId: string): boolean {
    return this.metadata.solution.answer.includes(optionId);
  }

  toggleCorrect(optionId: string) {
    const answers = this.metadata.solution.answer;
    const pos = answers.indexOf(optionId);

    if (pos === -1) {
      answers.push(optionId);
    } else {
      answers.splice(pos, 1);
    }

    this.changed.emit();
  }

  stopEditing() {
    this.isEditing = false;
  }

  startEditing() {
    if (this.editable) {
      this.isEditing = true;
    }
  }

  addOption() {
    if (this.metadata.data.options.length >= 8) {
      return;
    }

    this.metadata.data.options.push({ text: 'Default odpoved' });
  }

  removeOption() {
    this.metadata.data.options.pop();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isEditing && this.editableRefs) {
      const clickedInsideAny = this.editableRefs.some((ref) =>
        ref.nativeElement.contains(event.target),
      );

      if (!clickedInsideAny) {
        this.stopEditing();
        this.changed.emit();
      }
    }
  }
}
