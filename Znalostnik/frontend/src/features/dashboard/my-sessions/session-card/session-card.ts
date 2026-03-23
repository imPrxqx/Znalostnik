import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SessionsManager } from '@features/dashboard/services/sessions-manager';
import { Slide } from '@features/exercise-editor/components/slide/slide';
import { SessionState } from '@features/session/services/session-state';

@Component({
  selector: 'app-session-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss',
})
export class SessionCard {
  session = input.required<any>();
  manager = inject(SessionsManager);
  router = inject(Router);

  resultSession() {
    this.router.navigate([`/session/${this.session().id}/result`]);
  }

  openSession() {
    this.router.navigate([`/session/${this.session().id}/host`]);
  }

  deleteSession() {
    this.manager.deleteSession(this.session().id);
  }
}
