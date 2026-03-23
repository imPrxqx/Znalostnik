import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionApi {
  http = inject(HttpClient);

  loadSessionRole(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}/role`);
  }

  loadSession(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}`);
  }

  loadSessionUser(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}/me`);
  }

  joinSession(accessCode: string) {
    return this.http.post(`${environment.apiURL}/sessions/join?accessCode=${accessCode}`, null);
  }

  startSession(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/start`, null);
  }

  endSession(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/end`, null);
  }

  nextTask(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/next`, null);
  }

  previousTask(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/previous`, null);
  }

  deleteSession(sessionId: string) {
    return this.http.delete(`${environment.apiURL}/sessions/${sessionId}`);
  }
}
