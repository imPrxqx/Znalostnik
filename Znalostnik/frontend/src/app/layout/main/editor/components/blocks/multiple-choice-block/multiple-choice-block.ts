import { Component, Input } from '@angular/core';
import { BaseBlockComponent } from '../../block-registry';

@Component({
  selector: 'app-multiple-choice-block',
  imports: [],
  templateUrl: './multiple-choice-block.html',
  styleUrl: './multiple-choice-block.css',
})
export class MultipleChoiceBlock implements BaseBlockComponent {
  @Input() data: { content: string } = { content: '' };
  @Input() interactive: boolean = false;
}
