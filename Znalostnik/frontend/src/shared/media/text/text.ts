import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextStyle } from '@shared/models/format';

@Component({
  selector: 'app-text',
  imports: [CommonModule, FormsModule],
  templateUrl: './text.html',
  styleUrl: './text.scss',
})
export class Text implements AfterViewInit {
  content = input.required<string>();
  style = input.required<TextStyle>();
  container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  text = viewChild.required<ElementRef<HTMLParagraphElement>>('text');
  currentFontSize = signal(10);

  ngAfterViewInit() {
    const resizeObserver = new ResizeObserver(() => {
      this.calculateFontSize();
    });

    resizeObserver.observe(this.container().nativeElement);
  }

  constructor() {
    effect(() => {
      this.content();
      this.style();
      this.calculateFontSize();
    });
  }

  calculateFontSize() {
    const containerElement = this.container().nativeElement;
    const textElement = this.text().nativeElement;
    const min = 10;
    const max = this.style().fontSize;

    const isOverflow = () =>
      textElement.scrollWidth > containerElement.clientWidth ||
      textElement.scrollHeight > containerElement.clientHeight;

    let fontSize = max;

    requestAnimationFrame(() => {
      textElement.style.fontSize = `${fontSize}px`;

      while (fontSize > min && isOverflow()) {
        fontSize--;
        textElement.style.fontSize = `${fontSize}px`;
      }

      while (fontSize < max && !isOverflow()) {
        fontSize++;
        textElement.style.fontSize = `${fontSize}px`;
      }

      if (isOverflow()) {
        fontSize--;
        textElement.style.fontSize = `${fontSize}px`;
      }

      this.currentFontSize.set(fontSize);
    });
  }
}
