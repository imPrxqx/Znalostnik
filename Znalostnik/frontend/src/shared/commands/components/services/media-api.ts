import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

/**
 * Provides API methods for managing media files.
 */
@Injectable({
  providedIn: 'root',
})
export class MediaApi {
  http = inject(HttpClient);

  uploadMedia(formData: FormData) {
    return this.http.post(`${environment.apiURL}/media`, formData);
  }

  deleteMedia(mediaId: string) {
    return this.http.delete(`${environment.apiURL}/media/${mediaId}`);
  }

  getUserMedia() {
    return this.http.get(`${environment.apiURL}/media`);
  }
}
