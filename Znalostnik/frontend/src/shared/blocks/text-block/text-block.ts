import {
  Component,
  HostListener,
  ElementRef,
  input,
  ViewChildren,
  QueryList,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateTextCommandUi } from '@shared/commands/components/update-text-command-ui/update-text-command-ui';
import {
  Focusable,
  ViewModeType,
  Action,
  FormatComponent,
  TextFormat,
  ToolbarSupport,
  CommandUiComponent,
  ToolbarOutput,
} from '@shared/models/format';
import { UpdateTextCommand } from '@shared/commands/update-text-command';

@Component({
  selector: 'app-text-block',
  imports: [CommonModule, FormsModule],
  templateUrl: './text-block.html',
  styleUrl: './text-block.css',
})
export class TextBlock implements FormatComponent<TextFormat>, Focusable {
  @ViewChildren('editable') editableRefs!: QueryList<ElementRef>;
  protected editing = signal<boolean>(false);

  viewMode = input.required<ViewModeType>();
  format = input.required<TextFormat>();
  actions = output<Action>();

  startEditing() {
    this.editing.set(true);
    this.onFocus();
  }

  stopEditing(textarea: HTMLTextAreaElement) {
    this.editing.set(false);
    const newValue = textarea.value;
    this.applyText(newValue);
  }

  onFocus(): void {
    this.actions.emit({
      type: 'toolbar',
      payload: this,
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    console.log('klik');

    if (this.editing() && this.editableRefs) {
      const clickedInsideAny = this.editableRefs.some((ref) =>
        ref.nativeElement.contains(event.target),
      );

      if (!clickedInsideAny) {
        this.stopEditing(this.editableRefs.first.nativeElement);
      }
    }
  }

  applyText(newText: string): void {
    this.actions.emit({
      type: 'central',
      payload: new UpdateTextCommand(this.format(), newText),
    });
  }

  getToolbarCommands(): ToolbarOutput<TextFormat> {
    return {
      receiver: this.format(),
      components: [UpdateTextCommandUi],
    };
  }
}
