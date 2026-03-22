import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionsApi {
  http = inject(HttpClient);

  loadMySessions() {
    return this.http.get(`${environment.apiURL}/sessions/my`);
  }

  loadSession(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}`);
  }
}
