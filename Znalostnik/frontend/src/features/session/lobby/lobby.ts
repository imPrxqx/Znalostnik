import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionState, SessionUser, Team, TeamMember } from '../services/session-state';
import { Hub } from '../services/hub';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-lobby',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby {
  hub = inject(Hub);
  route = inject(ActivatedRoute);
  router = inject(Router);
  state = inject(SessionState);
  role = computed(() => this.state.role());
  sessionUsers = computed(() => this.state.sessionUsers());
  session = computed(() => this.state.session());
  sessionUser = computed(() => this.state.sessionUser());
  loading = computed(() => this.state.loading());
  teams = computed(() => this.state.teams());
  selectedTeam = signal<Team | undefined>(undefined);

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate([`/session/join`]);
      return;
    }

    this.state.loadSession(sessionId);
  }

  startSession() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      return;
    }

    this.state.startSession(sessionId);
  }

  createTeam() {
    this.selectedTeam.set(undefined);
    this.state.createSessionTeam(this.session()?.id!, 'New Team');
  }

  joinTeam(teamId: string) {
    this.selectedTeam.set(undefined);
    this.state.joinSessionTeam(this.session()?.id!, teamId);
  }

  selectTeam(teamId: string) {
    if (teamId === this.selectedTeam()?.id) {
      this.selectedTeam.set(undefined);
      return;
    }

    this.selectedTeam.set(this.teams()?.filter((team) => team.id === teamId)[0]);
  }
}
