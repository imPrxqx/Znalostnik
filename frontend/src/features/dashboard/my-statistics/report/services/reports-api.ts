import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

/**
 * Provides API methods for getting report raw data from session.
 */
@Injectable({
  providedIn: 'root',
})
export class ReportsApi {
  http = inject(HttpClient);

  loadReport(sessionId: string) {
    return this.http.get(`${environment.apiURL}/sessions/${sessionId}/report`);
  }
}
