import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { SessionState } from '../services/session-state';
import { ActivatedRoute, Router } from '@angular/router';
import { HotPotatoParticipant } from '../modes/hot-potato/hot-potato-participant/hot-potato-participant';
import { ClassicParticipant } from '../modes/classic/classic-participant/classic-participant';
import { SelfStudyParticipant } from '../modes/self-study/self-study-participant/self-study-participant';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-participant',
  imports: [
    MatProgressSpinnerModule,
    ClassicParticipant,
    HotPotatoParticipant,
    SelfStudyParticipant,
  ],
  templateUrl: './participant.html',
  styleUrl: './participant.scss',
})
export class Participant {
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
