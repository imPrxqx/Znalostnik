import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseBlockComponent } from '../../block-registry';

@Component({
  selector: 'app-true-false',
  imports: [],
  templateUrl: './true-false.html',
  styleUrl: './true-false.css',
})
export class TrueFalse implements BaseBlockComponent {
  @Input() interactive: boolean = false;
  @Input() solution: any;
  @Input() data: any;
  @Output() changed = new EventEmitter<void>();

  ngOnInit() {
    if (!this.data.hasOwnProperty('options')) {
      (this.data as any).options = { true: 'True', false: 'False' };
    }
  }
}
