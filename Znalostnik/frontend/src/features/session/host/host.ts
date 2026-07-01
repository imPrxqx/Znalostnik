import { Component, computed, inject, OnInit } from '@angular/core';
import { SessionState } from '../services/session-state';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Registry } from '@shared/models/registry';
import { NgComponentOutlet } from '@angular/common';
import { Hub } from '../services/hub';

@Component({
  selector: 'app-host',
  imports: [MatProgressSpinnerModule, NgComponentOutlet],
  templateUrl: './host.html',
  styleUrl: './host.scss',
})
export class Host implements OnInit {
  hub = inject(Hub);
  state = inject(SessionState);
  route = inject(ActivatedRoute);
  router = inject(Router);
  session = computed(() => this.state.session());
  loading = computed(() => this.state.loading());
  hostComponent = computed(() => {
    const session = this.session();

    if (session === undefined) {
      return undefined;
    }

    const hostComponent = Registry.getHostComponent(session.gameMode as string);
    return hostComponent;
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
