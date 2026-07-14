import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  input,
  signal,
  AfterViewInit,
  viewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from '@environments/environment';
import { ChoiceStyle, Media } from '@shared/models/blocks';

/**
 * Displays choice option content, optional media, and visual.
 */
@Component({
  selector: 'app-choice',
  imports: [CommonModule, MatIconModule, MatFormFieldModule, CommonModule, MatInputModule],
  templateUrl: './choice.html',
  styleUrl: './choice.scss',
})
export class Choice implements AfterViewInit {
  media = input<Media | undefined>(undefined);
  content = input.required<string>();
  style = input.required<ChoiceStyle>();
  isCorrect = input<boolean | undefined>(undefined);
  isSelected = input<boolean | undefined>(undefined);

  container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  text = viewChild<ElementRef<HTMLParagraphElement>>('text');

  currentFontSize = signal(10);
  mediaSize = signal(20);

  constructor() {
    effect(() => {
      this.style();
      this.content();
      this.calculateFontSize();
      this.calculateMediaSize();
    });
  }

  ngAfterViewInit() {
    const resizeObserver = new ResizeObserver(() => {
      this.calculateFontSize();
      this.calculateMediaSize();
    });

    resizeObserver.observe(this.container().nativeElement);
  }

  /**
   * Dynamically caluclates image size for better fit container
   */
  calculateMediaSize() {
    const width = this.container().nativeElement.clientWidth;

    let mediaSize;

    if (width >= 1400) {
      mediaSize = 20;
    } else if (width >= 1000) {
      mediaSize = 30;
    } else if (width >= 700) {
      mediaSize = 40;
    } else {
      mediaSize = 50;
    }

    this.mediaSize.set(mediaSize);
  }

  /**
   * Dynamically caluclates from base font size new font size to fit container
   */
  calculateFontSize() {
    if (!this.text()) {
      return;
    }

    const containerElement = this.container().nativeElement;
    const textElement = this.text()!.nativeElement;
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

  getMediaUrl(): string {
    return `${environment.apiURL}/media/${this.media()!.id}`;
  }
}
