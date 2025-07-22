import {
  Component,
  Input,
  ViewContainerRef,
  AfterViewInit, OnChanges,SimpleChanges
} from '@angular/core';
import { BlockRegistry } from '../../editor/components/block-registry';

@Component({
  selector: 'app-renderer',
  imports: [],
  templateUrl: './renderer.html',
  styleUrl: './renderer.css'
})
export class Renderer  implements OnChanges  {
  private viewContainer: ViewContainerRef;
  @Input() blocks: any[] = [];


  constructor(viewContainer: ViewContainerRef) {
    this.viewContainer = viewContainer;
  }

  ngOnChanges(changes: SimpleChanges): void {
        console.log("loading");

    if (changes['blocks']) {
      this.renderBlocks();
    }
        console.log("loaded");

  }

  renderBlocks(): void {
    console.log("START");


    this.viewContainer.clear();

    for (const block of this.blocks) {
      const componentType = BlockRegistry[block.type];

      if (!componentType) {
        console.warn(`unknown block: ${block.type}`);
        continue;
      }

      const componentRef = this.viewContainer.createComponent(componentType);

      if (block.data && componentRef.instance) {
        Object.assign(componentRef.instance, block.data);
      }
    }

    console.log("END");
  }
}
