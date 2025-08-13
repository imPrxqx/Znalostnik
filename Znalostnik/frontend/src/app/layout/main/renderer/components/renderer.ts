import {
  Component,
  Input,
  signal,
  ViewContainerRef,
  EventEmitter,
  Output,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { BlockRegistry, DocumentSchemas } from '../../editor/components/block-registry';
import { SequenceMode } from './sequence-mode/sequence-mode';

@Component({
  selector: 'app-renderer',
  imports: [],
  templateUrl: './renderer.html',
  styleUrl: './renderer.css',
})
export class Renderer {
  @ViewChild('modeContainer', { read: ViewContainerRef, static: true })
  modeContainer!: ViewContainerRef;
  @ViewChild('exercisesContainer', { read: ViewContainerRef, static: true })
  exercisesContainer!: ViewContainerRef;

  @Input() document: any;
  @Input() modeComponent: any = SequenceMode;
  @Input() answered: any = { answers: [] };
  @Input() editable: boolean = false;
  @Output() dataChanged = new EventEmitter<void>();
  @Output() answer = new EventEmitter<any>();

  selectedExercise = signal(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['document']) {
      if (this.editable === false) {
        this.createModeComponent();
      } else {
        this.modeContainer.clear();
        console.log(this.document);
        if (this.document.exercises.length === 0) {
          this.selectedExercise.set(null);
          return;
        }

        this.selectedExercise.set(this.document.exercises[0]);
      }

      this.renderBlocks();
    }

    if (changes['editable']) {
      if (this.editable === false) {
        this.createModeComponent();
      } else {
        this.modeContainer.clear();
      }

      this.renderBlocks();
    }
  }

  private createModeComponent() {
    this.modeContainer.clear();

    const compRef = this.modeContainer.createComponent(this.modeComponent);
    compRef.setInput('document', this.document);

    (compRef.instance as any).selectedExercise.subscribe((exercise: any) => {
      this.selectedExercise.set(exercise);
      this.renderBlocks();
    });
  }

  renderBlocks(): void {
    console.log(this.selectedExercise());
    if (this.selectedExercise() === null || this.selectedExercise() === undefined) {
      this.exercisesContainer.clear();
      return;
    }

    console.log('START');

    this.exercisesContainer.clear();

    console.log(this.selectedExercise()!['blocks'] || []);

    const exerciseSchema = this.selectedExercise()!['documentSchema'];
    const blocks: any = this.selectedExercise()!['blocks'];

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

      const componentRef = this.exercisesContainer.createComponent(componentType);
      console.log(this.editable);
      componentRef.setInput('metadata', block.metadata);
      componentRef.setInput('editable', this.editable);
      componentRef.setInput('exerciseId', this.selectedExercise()!['id']);

      if ('changed' in componentRef.instance && componentRef.instance.changed?.subscribe) {
        componentRef.instance.changed.subscribe(() => {
          this.dataChanged.emit();
        });
      }

      if ('answer' in componentRef.instance && componentRef.instance.answer?.subscribe) {
        componentRef.instance.answer.subscribe((data: any) => {
          console.log('Answer', data);
          this.answer.emit(data);
        });
      }

      if ('answered' in componentRef.instance) {
        componentRef.setInput('answered', this.answered);
      }
    }

    console.log('END');
  }
}
