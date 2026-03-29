import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionState, SessionUser } from '../services/session-state';
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
  selectedTeam = signal<SessionUser[] | undefined>(undefined);

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate([`/session/join`]);
      return;
    }

    this.state.ensureLoaded(sessionId);
  }

  startSession() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      return;
    }

    this.state.startSession(sessionId);
  }

  joinTeam(team: string) {}

  selectTeam(team: string) {
    this.selectedTeam.set(this.sessionUsers()?.filter((user) => user.team === team));
  }

  groupByTeam() {
    const teams: string[] = [];

    this.sessionUsers()?.forEach((user) => {
      if (!user.team) {
        user.team = 'No Team';
      }

      if (teams.includes(user.team)) {
        return;
      }

      teams.push(user.team);
    });

    return teams;
  }
}
