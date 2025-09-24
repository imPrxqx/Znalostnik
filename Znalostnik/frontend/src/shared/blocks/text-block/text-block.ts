import {
  Component,
  Input,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild,
  model,
  WritableSignal,
  input,
  output,
  InputSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseBlockComponent } from '@shared/models/exercise-task-block-components.model';
import { ExerciseTask } from '@shared/interfaces/exercise/exercise-task.interface';
import { CommandUIItem } from '@shared/interfaces/command/command-items.interface';
import { UpdateTextCommandUi } from '@shared/commands/components/update-text-command-ui/update-text-command-ui';
import { ExerciseTaskBlock } from '@shared/interfaces/exercise/exercise-task-block.interface';
import { TextBlockMetadata } from '@shared/interfaces/exercise/exercise-task-block-metadata.interface';

@Component({
  selector: 'app-text-block',
  imports: [CommonModule, FormsModule],
  templateUrl: './text-block.html',
  styleUrl: './text-block.css',
})
export class TextBlock implements BaseBlockComponent<TextBlockMetadata> {
  answered?: any;

  static readonly blockTemplate: string = 'text';
  @Input() exerciseId: string = '';
  readonly block = input.required<WritableSignal<ExerciseTaskBlock<TextBlockMetadata>>>();

  //readonly task = input.required<WritableSignal<ExerciseTask>>();

  commandList = output<CommandUIItem[]>();
  commandCreated = output<Command>();

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

    this.getCommandConfigs();
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

  applyText(newText: string) {
    const currentBlock: ExerciseTaskBlock = this.block()();

    this.block().set({
      ...currentBlock,
      metadata: {
        ...currentBlock.metadata,
        data: {
          ...currentBlock.metadata,
          content: newText,
        },
      },
    });
  }

  getCommandConfigs(): void {
    this.commandList.emit([{ component: UpdateTextCommandUi, receiver: this }]);
  }
}
