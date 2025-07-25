import {
  Component,
  Input,
  effect,
  ViewContainerRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BlockRegistry, DocumentSchemas } from '../../editor/components/block-registry';
import { CentralEditor } from '../../editor/components/central-editor';

@Component({
  selector: 'app-renderer',
  imports: [],
  templateUrl: './renderer.html',
  styleUrl: './renderer.css',
})
export class Renderer {
  private viewContainer: ViewContainerRef;
  @Input() interactive: boolean = false;

  constructor(
    viewContainer: ViewContainerRef,
    private centralEditorService: CentralEditor,
  ) {
    this.viewContainer = viewContainer;

    effect(() => {
      const exercises = this.centralEditorService.document()['exercises'];
      if (exercises) {
        this.renderBlocks();
      }
    });
  }

  renderBlocks(): void {
    console.log('START');

    this.viewContainer.clear();

    console.log(this.centralEditorService.selectedExercise()['blocks'] || []);

    const exerciseSchema = this.centralEditorService.selectedExercise()['documentSchema'];
    const blocks = this.centralEditorService.selectedExercise()['blocks'];

    console.log('exercise schema', exerciseSchema);
    console.log('blocks', blocks);

    const renderOrder = DocumentSchemas[exerciseSchema]?.renderOrder || [];

    for (const order of renderOrder) {
      const block = blocks.find((b: any) => b.blockSchema === order);

      if (!block) {
        console.warn(`Block of type ${order} not found in exercise`);
        continue;
      }

      console.log('Rendering block:', block);
      const componentType = BlockRegistry[block.blockTemplate];

      if (!componentType) {
        console.warn(`Unknown block type: ${block.type}`);
        continue;
      }

      const componentRef = this.viewContainer.createComponent(componentType);

      componentRef.setInput('data', block.data);
      componentRef.setInput('interactive', this.interactive);
    }

    console.log('END');
  }
}
