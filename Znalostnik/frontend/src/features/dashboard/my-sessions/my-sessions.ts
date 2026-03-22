import { Component, computed, inject } from '@angular/core';
import { SessionCard } from './session-card/session-card';
import { SessionsManager } from '../services/sessions-manager';

@Component({
  selector: 'app-my-sessions',
  imports: [SessionCard],
  templateUrl: './my-sessions.html',
  styleUrl: './my-sessions.scss',
})
export class MySessions {
  manager = inject(SessionsManager);
  sessions = computed(() => this.manager.sessions());

  ngAfterViewInit() {
    this.manager.loadMySessions();
  }
}
