import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionState } from '../services/session-state';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateTeamDialog } from './create-team-dialog/create-team-dialog';
import { MatDialog } from '@angular/material/dialog';
import { JoinTeamDialog } from './join-team-dialog/join-team-dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Hub } from '../services/hub';

/**
 * Displays session lobby where participants can join,
 * create teams and wait until the session starts.
 * Host can view summary of all joined participants and can start session.
 */
@Component({
  selector: 'app-lobby',
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSliderModule,
    MatProgressBarModule,
  ],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby implements OnInit {
  hub = inject(Hub);
  route = inject(ActivatedRoute);
  router = inject(Router);
  state = inject(SessionState);
  loading = computed(() => this.state.loading());
  role = computed(() => this.state.role());
  respondType = computed(() => this.state.session()?.respondType);
  session = computed(() => this.state.session());
  sessionUser = computed(() => this.state.sessionUser());
  sessionUsers = computed(() => this.state.sessionUsers());
  teams = computed(() => this.state.teams());
  dialog = inject(MatDialog);

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate([`/home`]);
      return;
    }

    this.state.loadSession(sessionId);
  }

  startSession() {
    if (!this.session()) {
      return;
    }

    this.state.startSession(this.session()!.id);
  }

  /**
   * Opens a dialog for creating team, dialog then returns team name for creating team.
   */
  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialog, {
      width: '500px',
      maxWidth: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.state.createSessionTeam(this.session()!.id, result);
      }
    });
  }

  /**
   * Opens a dialog for joining team, dialog then retuns of selected team to jon
   */
  openJoinTeamDialog(): void {
    const dialogRef = this.dialog.open(JoinTeamDialog, {
      width: '500px',
      height: '500px',
      data: {
        teams: this.teams(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.state.joinSessionTeam(this.session()!.id, result);
      }
    });
  }

  getTeamName(sessionUserId: string | undefined) {
    return this.teams().find((t) => t.teamMembers.find((tm) => tm.id == sessionUserId))?.name;
  }
}
