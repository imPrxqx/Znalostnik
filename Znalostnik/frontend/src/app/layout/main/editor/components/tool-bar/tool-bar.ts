import { Component, Inject, Input, Output, LOCALE_ID } from '@angular/core';
import { BlockRegistry, DocumentSchemas } from '../block-registry';

@Component({
  selector: 'app-tool-bar',
  imports: [],
  templateUrl: './tool-bar.html',
  styleUrl: './tool-bar.css',
})
export class ToolBar {
  allDocumentGroups: any[] = [];

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  ngOnInit() {
    this.allDocumentGroups = Object.entries(DocumentSchemas).map(([document, schema]) => ({
      alias: (schema.alias as any)[this.locale],
      body: Object.entries(schema.bodyMeta).map(([template, meta]) => ({
        types: meta.types.map((type: any) => ({
          alias: (type.alias as any)[this.locale],
        })),
        alias: (meta.alias as any)[this.locale],
      })),
    }));
  }

  onAdd(template: string, type: string) {}

  onRemove(template: string, type: string) {}
}
