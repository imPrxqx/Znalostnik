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
  @Input() solution: any;
  @Input() data: any;
  @Input() interactive: boolean = false;
  @Output() changed = new EventEmitter<void>();

  isEditing = false;

  ngOnInit() {
    if (!this.data.hasOwnProperty('options')) {
      (this.data as any).options = [
        { text: 'Odpoved 1' },
        { text: 'Odpoved 2' },
        { text: 'Odpoved 3' },
        { text: 'Odpoved 4' },
      ];
    }
  }

  addOption() {
    if (this.data.options.length >= 8) {
      return;
    }

    this.data.options.push({ text: 'Default odpoved' });
  }

  removeOption() {
    this.data.options.pop();
  }
}
