import { Component, computed, inject, signal } from '@angular/core';
import { SessionState } from '../services/session-state';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotPotatoHost } from '../modes/hot-potato/hot-potato-host/hot-potato-host';
import { ClassicHost } from '../modes/classic/classic-host/classic-host';
import { SelfStudyHost } from '../modes/self-study/self-study-host/self-study-host';

@Component({
  selector: 'app-host',
  imports: [MatProgressSpinnerModule, HotPotatoHost, ClassicHost, SelfStudyHost],
  templateUrl: './host.html',
  styleUrl: './host.scss',
})
export class Host {
  state = inject(SessionState);
  route = inject(ActivatedRoute);
  router = inject(Router);
  session = computed(() => this.state.session());
  loading = computed(() => this.state.loading());

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      this.router.navigate([`/session/join`]);
      return;
    }

    this.state.loadSession(sessionId);
  }
}
