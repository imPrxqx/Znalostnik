import { computed, effect, inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SessionState } from './session-state';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Hub {
  private connection?: signalR.HubConnection;
  private sessionState = inject(SessionState);

  constructor() {
    effect(() => {
      this.disconnect();
      this.connect();
    });
  }

  async connect() {
    if (this.connection) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiURL}/hub`)
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnected(() => {
      console.log('Reconnected');
    });

    this.connection.onreconnecting(() => {
      console.log('Reconnecting');
    });

    this.connection.onclose(() => {
      console.log('Disconnected');
    });

    this.connection.on('NotifySessionUpdated', (data) => {
      console.log('Session Updated');
      this.sessionState.loadSession(this.sessionState.session()?.id!);
    });

    await this.connection.start();
    await this.connection.invoke('JoinSessionAsync', this.sessionState.session()?.id);
  }

  async disconnect() {
    if (!this.connection) {
      return;
    }

    await this.connection.stop();
  }
}
