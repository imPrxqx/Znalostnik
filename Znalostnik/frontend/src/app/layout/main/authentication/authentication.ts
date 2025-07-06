import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private readonly apiUrl = 'http://localhost:8000/api';
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(data: any) {
    this.http.post(`${this.apiUrl}/login?useCookies=true`, data, { withCredentials: true }).subscribe({
      next: user => {
          console.log('Login success:', data);
          this.loggedIn.next(true);
        }, 
        error: err => {
          console.log('Login not success:', null);
        }
    });
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
            this.loggedIn.next(false);
      },
      error: () => {
      }
    });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  loadUser() {
    this.http.get<{ username: string }>(`${this.apiUrl}/account/me`, { withCredentials: true })
      .subscribe({
        next: user => {
          console.log('loadUser success:', user);
          this.loggedIn.next(true);         
        }, 

        error: err => {
          console.log('loadUser not success:', null);
          this.loggedIn.next(false);
        }
      });

  }
}
