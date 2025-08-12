import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sequence-mode',
  imports: [],
  templateUrl: './sequence-mode.html',
  styleUrl: './sequence-mode.css',
})
export class SequenceMode {
  @Input() document!: any;
  @Output() selectedExercise = new EventEmitter<any>();

  private index = 0;

  ngOnInit() {
    this.current();
  }

  next() {
    if (this.index < this.document.exercises.length - 1) {
      this.index++;
      this.current();
    }
  }

  prev() {
    if (this.index > 0) {
      this.index--;
      this.current();
    }
  }

  current() {
    this.selectedExercise.emit(this.document.exercises[this.index]);
  }
}
