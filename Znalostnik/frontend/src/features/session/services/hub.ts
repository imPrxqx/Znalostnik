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
  private connectedSessionId: string | undefined = undefined;

  constructor() {
    effect(() => {
      const session = this.sessionState.session();

      if (session === undefined) {
        return;
      }

      if (this.connectedSessionId === session.id) {
        return;
      }

      if (this.connection) {
        this.disconnect();
      }

      this.connect(session.id);
    });
  }

  private async connect(sessionId: string) {
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

    this.connection.on('SessionUpdated', () => {
      console.log('Session Updated');
      this.sessionState.updateSession();
    });

    this.connection.on('TeamUpdated', () => {
      console.log('Team Updated');
      this.sessionState.updateSessionTeams();
    });

    this.connection.on('JoinUpdated', () => {
      console.log('Join Updated');
      this.sessionState.updateSessionUsers();
    });

    this.connection.on('AnswerSubmitted', () => {
      console.log('Answer Submitted');
      this.sessionState.updateAnswer();
    });

    await this.connection.start();
    await this.connection.invoke('JoinSessionAsync', this.sessionState.session()?.id);
    this.connectedSessionId = sessionId;
    console.log('Hub connected');
  }

  private async disconnect() {
    if (!this.connection) {
      return;
    }

    await this.connection.stop();
    this.connectedSessionId = undefined;
    console.log('Hub disconnected');
  }
}
