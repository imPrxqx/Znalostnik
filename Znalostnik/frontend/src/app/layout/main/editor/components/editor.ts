import { Component, signal } from '@angular/core';
import { Renderer } from '../../renderer/components/renderer';
import { ToolBar } from './tool-bar/tool-bar';
import { DocumentSchemas } from './block-registry';

@Component({
  selector: 'app-editor',
  imports: [Renderer, ToolBar],
  templateUrl: './editor.html',
  styleUrl: './editor.css',
})
export class Editor {
  blocks = signal<any[]>([]);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);

        if (Array.isArray(json)) {
          this.blocks.set(json);
        } else {
          console.error('Json is not array');
        }
      } catch (e) {
        console.error('Json Parser error');
      }
    };

    reader.readAsText(file);
  }

  validateDocumentType(documentType: string): boolean {
    return true;
  }

  saveJson() {
    if (this.blocks().length === 0) {
      console.warn('No blocks to save');
      return;
    }

    const json = JSON.stringify(this.blocks());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'blocks.json';
    a.click();
  }

  addBlock(type: string) {}

  updateBlock(id: string, data: any) {}

  removeBlock(id: string) {}
}
