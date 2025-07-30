import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  addOption() {
    if (this.metadata.data.options.length >= 8) {
      return;
    }

    this.metadata.data.options.push({ text: 'Default odpoved' });
  }

  removeOption() {
    this.metadata.data.options.pop();
  }
}
