import { Component, Inject, LOCALE_ID } from '@angular/core';
import { DocumentSchemas } from '../block-registry';
import { CentralEditor } from '../central-editor';

@Component({
  selector: 'app-tool-bar',
  imports: [],
  templateUrl: './tool-bar.html',
  styleUrl: './tool-bar.css',
})
export class ToolBar {
  allDocumentGroups: any[] = [];

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private centralEditorService: CentralEditor,
  ) {}

  ngOnInit() {
    this.allDocumentGroups = Object.entries(DocumentSchemas).map(([document, schema]) => ({
      key: document,
      alias: (schema.alias as any)[this.locale],
      body: Object.entries(schema.bodyMeta).map(([template, meta]) => ({
        key: template,
        types: meta.types.map((type: any) => ({
          key: type.key,
          alias: (type.alias as any)[this.locale],
        })),
        alias: (meta.alias as any)[this.locale],
      })),
    }));
  }

  useBlock(schema: string, block: string, type: string) {
    this.centralEditorService.setExerciseBlock(schema, block, type);
  }

  createDefaultExercise(schema: string) {
    console.log('creating default exercise');
    this.centralEditorService.createDefaultExercise(schema);
  }
}
