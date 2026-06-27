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

  loadSessionTeams(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}/teams`);
  }

  loadSessionUsers(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}/joined`);
  }

  joinSessionTeam(sessionId: string, teamId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/teams/${teamId}/join`, null);
  }

  createSessionTeam(sessionId: string, teamName: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/teams/create`, {
      teamName: teamName,
    });
  }

  confirmCurrentAnswer(sessionId: string, answer: any) {
    console.log('confirming answer: ', answer);
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/answers/confirm`, answer);
  }

  submitAnswer(sessionId: string, answer: any) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/answers`, answer);
  }

  joinSession(accessCode: string, username: string) {
    return this.http.post(`${environment.apiURL}/sessions/join`, {
      accessCode: accessCode,
      userName: username,
    });
  }

  startSession(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/start`, null);
  }

  endSession(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/end`, null);
  }

  endSessionRound(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/end-round`, null);
  }

  nextActivity(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/next`, null);
  }

  previousActivity(sessionId: string) {
    return this.http.post(`${environment.apiURL}/sessions/${sessionId}/previous`, null);
  }

  deleteSession(sessionId: string) {
    return this.http.delete(`${environment.apiURL}/sessions/${sessionId}`);
  }
}
