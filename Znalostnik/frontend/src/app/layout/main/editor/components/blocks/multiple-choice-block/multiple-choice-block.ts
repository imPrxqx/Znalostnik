import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
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
  @Output() answered = new EventEmitter<{ blockTemplate: string; answer: any }>();

  isEditing = false;
  @ViewChildren('editable') editableRefs!: QueryList<ElementRef>;

  ngOnInit() {
    if (!this.metadata.hasOwnProperty('data')) {
      (this.metadata as any).data = {};

      (this.metadata as any).data.options = [
        { text: 'Odpoved 1' },
        { text: 'Odpoved 2' },
        { text: 'Odpoved 3' },
        { text: 'Odpoved 4' },
      ];
    }
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
