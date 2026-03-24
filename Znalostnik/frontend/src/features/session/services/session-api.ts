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

  loadSubmission(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}/submissions`);
  }

  loadAnswer(sessionId: string, submissionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}/submissions/${submissionId}`);
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

  submitAnswer(sessionId: string, submissionId: string, answer: any) {
    return this.http.post(
      `${environment.apiURL}/sessions/${sessionId}/submissions/${submissionId}`,
      answer,
    );
  }

  deleteSession(sessionId: string) {
    return this.http.delete(`${environment.apiURL}/sessions/${sessionId}`);
  }
}
