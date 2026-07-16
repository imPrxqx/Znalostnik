import { Component, computed, inject, OnInit } from '@angular/core';
import { SessionState } from '../services/session-state';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgComponentOutlet } from '@angular/common';
import { Hub } from '../services/hub';
import { RegistrySession } from '@shared/registry/registry-session';

/**
 * Displays dynamically participant component from current session game mode.
 */
@Component({
  selector: 'app-participant',
  imports: [MatProgressSpinnerModule, NgComponentOutlet],
  templateUrl: './participant.html',
  styleUrl: './participant.scss',
})
export class Participant implements OnInit {
  hub = inject(Hub);
  state = inject(SessionState);
  route = inject(ActivatedRoute);
  router = inject(Router);
  session = computed(() => this.state.session());
  loading = computed(() => this.state.loading());
  participantComponent = computed(() => {
    const session = this.session();

    if (session === undefined) {
      return undefined;
    }

    const participantComponent = RegistrySession.getParticipantComponent(
      session.gameMode as string,
    );
    return participantComponent;
  });

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate([`/home`]);
      return;
    }

    this.state.loadSession(sessionId);
  }
}
