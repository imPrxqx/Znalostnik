import {
  Component,
  Input,
  effect,
  ViewContainerRef,
  EventEmitter,
  Output,
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

  @Input() document: any = null;
  @Input() selectedExercise: any = null;
  @Input() solutions: any = null;
  @Input() interactive: boolean = false;
  @Output() dataChanged = new EventEmitter<void>();

  constructor(viewContainer: ViewContainerRef) {
    this.viewContainer = viewContainer;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['document'] ||
      changes['selectedExercise'] ||
      changes['solutions'] ||
      changes['interactive']
    ) {
      this.renderBlocks();
    }
  }

  renderBlocks(): void {
    console.log('START');

    this.viewContainer.clear();

    console.log(this.selectedExercise['blocks'] || []);

    const exerciseSchema = this.selectedExercise['documentSchema'];
    const blocks = this.selectedExercise['blocks'];

    console.log('exercise schema', exerciseSchema);
    console.log('blocks', blocks);

    const renderOrder = DocumentSchemas[exerciseSchema]?.renderOrder || [];

    const missingBlocks = renderOrder.filter(
      (order) => !blocks.find((b: any) => b.blockSchema === order),
    );

    if (missingBlocks.length > 0) {
      console.error(`Missing required blocks in exercise`);
      return;
    }

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

      if ('solutions' in componentRef.instance && this.solutions != null) {
        componentRef.setInput('solutions', this.solutions);
      }

      if ('changed' in componentRef.instance && componentRef.instance.changed?.subscribe) {
        componentRef.instance.changed.subscribe(() => {
          this.dataChanged.emit();
        });
      }
    }

    console.log('END');
  }
}
