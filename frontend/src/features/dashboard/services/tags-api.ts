import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

/**
 * Provides API methods for managing tags and exercise tags.
 */
@Injectable({
  providedIn: 'root',
})
export class TagsApi {
  http = inject(HttpClient);

  loadTags() {
    return this.http.get(`${environment.apiURL}/tags`);
  }

  loadExerciseTags(exerciseId: string) {
    return this.http.get(`${environment.apiURL}/tags/exercises/${exerciseId}`);
  }

  createTag(name: string) {
    return this.http.post(`${environment.apiURL}/tags`, {
      name: name,
    });
  }

  deleteTag(tagId: string) {
    return this.http.delete(`${environment.apiURL}/tags/${tagId}`);
  }

  addTagToExercise(exerciseId: string, tagId: string) {
    return this.http.post(`${environment.apiURL}/tags/${tagId}/exercises/${exerciseId}`, null);
  }

  removeTagFromExercise(exerciseId: string, tagId: string) {
    return this.http.delete(`${environment.apiURL}/tags/${tagId}/exercises/${exerciseId}`);
  }
}
