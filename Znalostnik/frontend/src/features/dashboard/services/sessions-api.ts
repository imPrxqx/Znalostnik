import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { GameSetting } from '@shared/models/session';

@Injectable({
  providedIn: 'root',
})
export class SessionsApi {
  http = inject(HttpClient);

  createSession(
    exerciseId: string,
    title: string,
    respondType: string,
    gameMode: string,
    gameSetting: GameSetting,
  ) {
    return this.http.post(`${environment.apiURL}/sessions`, {
      exerciseId: exerciseId,
      title: title,
      respondType: respondType,
      gameMode: gameMode,
      gameSetting: gameSetting,
    });
  }

  loadMyActiveSessions() {
    return this.http.get(`${environment.apiURL}/sessions/active`);
  }

  loadMyFinishedSessions() {
    return this.http.get(`${environment.apiURL}/sessions/finished`);
  }

  loadSession(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}`);
  }

  deleteSession(sessionId: string) {
    return this.http.delete(`${environment.apiURL}/sessions/${sessionId}`);
  }
}
