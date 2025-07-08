import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, EMPTY } from 'rxjs';
import { BlobOptions } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private apiUrl = 'http://localhost:8000/api';
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login?useCookies=true`, data, { withCredentials: true }).pipe(tap(() => this.isLoggedIn.next(true)));
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, null, { withCredentials: true }).pipe(tap(() => this.isLoggedIn.next(false)));
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true }).pipe(tap(() => this.login(data).pipe(tap(() => this.isLoggedIn.next(true))).subscribe()));
  }

  loadUser() {
    return this.http.get<{ username: string }>(`${this.apiUrl}/account/me`, { withCredentials: true }).pipe(tap(() => this.isLoggedIn.next(true)));
  }
}
