import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionState } from '../services/session-state';
import { Hub } from '../services/hub';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lobby',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby {
  hub = inject(Hub);
  route = inject(ActivatedRoute);
  router = inject(Router);
  state = inject(SessionState);
  sessionUsers = computed(() => this.state.sessionUsers());

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate([`/session/join`]);
      return;
    }

    this.state.loadSession(sessionId);
    this.state.loadSessionUsers(sessionId);
  }

  startSession() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      return;
    }

    this.state.startSession(sessionId);
  }
}
