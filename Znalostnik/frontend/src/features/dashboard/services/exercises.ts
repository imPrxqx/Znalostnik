import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Exercise {
  id: string;
  title: string;
  type: string;
  content?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Exercises {}
