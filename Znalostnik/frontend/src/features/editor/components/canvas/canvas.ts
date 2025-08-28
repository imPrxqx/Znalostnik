import { Component, inject, HostListener } from '@angular/core';
import { Renderer } from '../../../../shared/renderer/components/renderer';
import { ToolBar } from '../tool-bar/tool-bar';
import { ListExercises } from '../list-exercises/list-exercises';
import { CentralEditor } from '../../services/central-editor';

@Component({
  selector: 'app-canvas',
  imports: [Renderer, ToolBar, ListExercises],
  templateUrl: './canvas.html',
  styleUrl: './canvas.css',
})
export class Canvas {
  centralEditorService: CentralEditor = inject(CentralEditor);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        this.centralEditorService.loadFromJson(reader.result as string);
      } catch (e) {
        console.error('Json Parser error');
      }
    };

    reader.readAsText(file);
  }

  saveJson() {
    const json = this.centralEditorService.getJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'blocks.json';
    a.click();
  }

  onBlockChanged() {
    console.log('Catched emit ');
    this.centralEditorService.setSnapshot();
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      this.centralEditorService.undo();
    } else if (event.ctrlKey && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      this.centralEditorService.redo();
    }
  }

  toggleEditingMode() {
    this.centralEditorService.toggleEditingMode();
  }
}
