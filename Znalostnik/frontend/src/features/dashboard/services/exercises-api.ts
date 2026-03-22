import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExercisesApi {
  http = inject(HttpClient);

  loadMyExercises(page: number = 1, pageSize: number = 200) {
    return this.http.get(`${environment.apiURL}/exercises?page=${page}&pageSize=${pageSize}`);
  }

  createExercise(
    title: string = 'New Exercise',
    mode: string = 'Interactive',
    settings: string = '{}',
  ) {
    return this.http.post(`${environment.apiURL}/exercises`, {
      title: title,
      mode: mode,
      settings: settings,
    });
  }

  createSession(exerciseId: string) {
    return this.http.post(`${environment.apiURL}/sessions`, {
      exerciseId: exerciseId,
    });
  }

  loadExercise(exerciseId: string) {
    return this.http.get(`${environment.apiURL}/exercises/${exerciseId}`);
  }

  loadTask(exerciseId: string, taskId: string) {
    return this.http.get(`${environment.apiURL}/exercises/${exerciseId}/tasks/${taskId}`);
  }

  deleteExercise(exerciseId: string) {
    return this.http.delete(`${environment.apiURL}/exercises/${exerciseId}`);
  }

  saveExercise(exerciseId: string, json: any) {
    return this.http.put(`${environment.apiURL}/exercises/${exerciseId}`, json, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
