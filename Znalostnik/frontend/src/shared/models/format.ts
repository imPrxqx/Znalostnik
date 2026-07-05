import { v4 as uuidv4 } from 'uuid';
import { randomQuestion, randomWord } from './activity';
import { signal } from '@angular/core';

export class Media {
  id = '';
  fileName = '';
  contentType = '';
}

export interface ChoiceOptionConfiguration {
  id: string;
  text: string;
  media: Media;
  style: ChoiceStyle;
}

export class ChoiceStyle {
  fontFamily = 'Arial';
  fontSize = 32;
  color = '#000000';
  bold = false;
  italic = false;
  underline = false;
  backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 85%)`;
}

export interface TextConfiguration {
  text: string;
  style: TextStyle;
}

export class TextStyle {
  fontFamily = 'Arial';
  fontSize = 64;
  color = '#000000';
  bold = false;
  italic = false;
  underline = false;
}

export class MultiChoiceOption {
  options: ChoiceOption[] = [
    new ChoiceOption(undefined),
    new ChoiceOption(undefined),
    new ChoiceOption(undefined),
    new ChoiceOption(undefined),
  ];

  addOption(newOption: ChoiceOption) {
    this.options.push(newOption);
  }

  removeOption() {
    if (this.options.length === 0) {
      return;
    }
    this.options.pop();
  }

  removeOptionById(optionId: string) {
    if (this.options.length === 0) {
      return;
    }
    this.options = this.options.filter((o) => o.id !== optionId);
  }
}

export class ChoiceOption {
  id: string = uuidv4();
  text = signal<string>(randomWord());
  style = signal<ChoiceStyle>(new ChoiceStyle());
  media = signal<Media | undefined>(undefined);

  constructor(data?: ChoiceOptionConfiguration) {
    if (data?.id) {
      this.id = data.id;
    }

    if (data?.text) {
      this.text.set(data.text);
    }

    if (data?.media) {
      const media = new Media();
      media.id = data?.media?.id;
      media.fileName = data?.media?.fileName;
      media.contentType = data?.media?.contentType;
      this.media.set(media);
    }

    if (data?.style) {
      const style = new ChoiceStyle();

      if (data.style?.fontFamily) {
        style.fontFamily = data.style.fontFamily;
      }

      if (data.style?.fontSize !== undefined) {
        style.fontSize = data.style.fontSize;
      }

      if (data.style?.color) {
        style.color = data.style.color;
      }

      if (data.style?.backgroundColor) {
        style.backgroundColor = data.style.backgroundColor;
      }

      if (data.style?.bold) {
        style.bold = data.style.bold;
      }

      if (data.style?.italic) {
        style.italic = data.style.italic;
      }

      if (data.style?.underline) {
        style.underline = data.style.underline;
      }

      this.style.set(style);
    }
  }

  setContent(value: string) {
    this.text.set(value);
  }

  setStyle(newStyle: ChoiceStyle) {
    this.style.set(newStyle);
  }

  setMedia(newMedia: Media | undefined) {
    if (newMedia === undefined) {
      this.media.set(undefined);
      return;
    }

    this.media.set(newMedia);
  }
}

export class Text {
  text = signal<string>(randomQuestion());
  style = signal<TextStyle>(new TextStyle());
  constructor(data?: TextConfiguration) {
    if (data?.text) {
      this.text.set(data.text);
    }

    if (data?.style) {
      const style = new TextStyle();

      if (data.style?.fontFamily) {
        style.fontFamily = data.style.fontFamily;
      }

      if (data.style?.fontSize) {
        style.fontSize = data.style.fontSize;
      }

      if (data.style?.color) {
        style.color = data.style.color;
      }

      if (data.style?.bold) {
        style.bold = data.style.bold;
      }

      if (data.style?.italic) {
        style.italic = data.style.italic;
      }

      if (data.style?.underline) {
        style.underline = data.style.underline;
      }

      this.style.set(style);
    }
  }

  setContent(newContent: string) {
    this.text.set(newContent);
  }

  setStyle(newStyle: TextStyle) {
    this.style.set(newStyle);
  }
}
