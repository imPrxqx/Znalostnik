import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

/**
 * Provides API methods for managing exercises.
 */
@Injectable({
  providedIn: 'root',
})
export class ExercisesApi {
  http = inject(HttpClient);

  loadMyExercises() {
    return this.http.get(`${environment.apiURL}/exercises`);
  }

  createExercise(title: string) {
    return this.http.post(`${environment.apiURL}/exercises`, {
      title: title,
    });
  }

  loadExercise(exerciseId: string) {
    return this.http.get(`${environment.apiURL}/exercises/${exerciseId}`);
  }

  loadFirstActivity(exerciseId: string) {
    return this.http.get(`${environment.apiURL}/exercises/${exerciseId}/activities/first`);
  }

  deleteExercise(exerciseId: string) {
    return this.http.delete(`${environment.apiURL}/exercises/${exerciseId}`);
  }

  saveExercise(exerciseId: string, json: unknown) {
    return this.http.put(`${environment.apiURL}/exercises/${exerciseId}`, json, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
