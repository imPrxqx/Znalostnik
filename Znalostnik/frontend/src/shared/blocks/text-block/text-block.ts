import {
  Component,
  Input,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseBlockComponent } from '@shared/models/block-registry';

@Component({
  selector: 'app-text-block',
  imports: [CommonModule, FormsModule],
  templateUrl: './text-block.html',
  styleUrl: './text-block.css',
})
export class TextBlock implements BaseBlockComponent {
  static readonly blockTemplate: string = 'text';
  @Input() exerciseId: string = '';

  @Input() metadata: any;
  @Input() editable: boolean = false;
  @Output() changed = new EventEmitter<void>();
  isEditing = false;

  @ViewChild('editable') editableRef!: ElementRef;

  ngOnInit() {
    if (!this.metadata.hasOwnProperty('data')) {
      (this.metadata as any).data = {};
      (this.metadata as any).data.content = 'Default Text';
    }
  }

  startEditing() {
    if (this.editable) {
      this.isEditing = true;
    }
  }

  stopEditing() {
    this.isEditing = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    console.log('klik');

    if (this.isEditing && this.editableRef) {
      const clickedInside = this.editableRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.stopEditing();
        this.changed.emit();
      }
    }
  }
}
