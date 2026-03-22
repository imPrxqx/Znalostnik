import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionApi {
  http = inject(HttpClient);

  joinSession(accessCode: string) {
    return this.http.post(`${environment.apiURL}/sessions/join?accessCode=${accessCode}`, null);
  }

  loadSession(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}`);
  }

  loadSessionUser(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}/me`);
  }
}
