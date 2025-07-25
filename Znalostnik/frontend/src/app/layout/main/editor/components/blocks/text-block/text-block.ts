import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseBlockComponent } from '../../block-registry';

@Component({
  selector: 'app-text-block',
  imports: [CommonModule, FormsModule],
  templateUrl: './text-block.html',
  styleUrl: './text-block.css',
})
export class TextBlock implements BaseBlockComponent<{ content: string }> {
  @Input() data: { content: string } = { content: '' };
  @Input() interactive: boolean = false;

  isEditing = false;

  startEditing() {
    if (this.interactive) {
      this.isEditing = true;
    }
  }

  stopEditing() {
    this.isEditing = false;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.stopEditing();
    }
  }

  toJSON() {
    return {
      blockSchema: 'quizText',
      blockTemplate: 'text',
      data: { ...this.data },
    };
  }
}
