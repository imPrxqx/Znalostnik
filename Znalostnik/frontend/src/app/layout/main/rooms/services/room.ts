import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class Room {
  private apiUrl = environment.apiURL + 'room';
  public connectionHub: signalR.HubConnection | null = null;
  public connectionRejected$ = new Subject<string>();
  public connectionAccepted$ = new Subject<void>();

  private playersSubject = new BehaviorSubject<string[]>([]);
  public players$ = this.playersSubject.asObservable();

  constructor(private http: HttpClient) {}

  joinRoom(roomId: string, password: string, username: string): Observable<boolean> {
    const url = this.apiUrl + `hub?roomId=${roomId}&username=${username}&password=${password}`;
    return new Observable<boolean>((observer) => {
      this.connectionHub = new signalR.HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .build();

      this.registerHubEvents();

      this.connectionHub.start().catch((err) => {
        console.error('Error when connecting:', err);
      });
    });
  }

  createRoom(): Observable<any> {
    return this.http.post(this.apiUrl, null);
  }

  registerHubEvents() {
    if (!this.connectionHub) {
      return;
    }

    this.connectionHub.on('UpdatePlayers', (players: string[]) => {
      this.playersSubject.next(players);
    });

    this.connectionHub.on('ConnectionAccepted', () => {
      this.connectionAccepted$.next();
    });

    this.connectionHub.on('ConnectionRejected', (message: string) => {
      this.connectionRejected$.next(message);
      this.connectionHub!.stop();
    });
  }
}
