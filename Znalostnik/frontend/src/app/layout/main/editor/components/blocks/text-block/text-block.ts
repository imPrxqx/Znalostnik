import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseBlockComponent } from '../../block-registry';

@Component({
  selector: 'app-text-block',
  imports: [CommonModule, FormsModule],
  templateUrl: './text-block.html',
  styleUrl: './text-block.css',
})
export class TextBlock implements BaseBlockComponent {
  @Input() data: any;

  ngOnInit() {
    if (!this.data.hasOwnProperty('content')) {
      (this.data as any).content = 'Default Text';
    }
  }

  @Input() interactive: boolean = false;
  @Output() changed = new EventEmitter<void>();

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
      this.changed.emit();
    }
  }
}
