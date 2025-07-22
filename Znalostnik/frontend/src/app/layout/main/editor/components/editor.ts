import { Component, signal } from '@angular/core';
import { Renderer } from '../../renderer/components/renderer';
@Component({
  selector: 'app-editor',
  imports: [Renderer],
  templateUrl: './editor.html',
  styleUrl: './editor.css',
})
export class Editor {

  blocks = signal<any []>([]);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0)  {
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

  saveJson() {

  }

  addBlock(type: string) {

  }

  updateBlock(id: string, data: any) {

  }

  removeBlock(id: string) {
  }
}
