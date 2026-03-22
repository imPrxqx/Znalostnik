import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Slide } from '@features/exercise-editor/components/slide/slide';

@Component({
  selector: 'app-session-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss',
})
export class SessionCard {
  session = input.required<any>();

  resultSession() {}

  openSession() {}

  deleteSession() {}
}
