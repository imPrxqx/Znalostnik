import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder, } from '@microsoft/signalr';

@Component({
  selector: 'app-room-hub',
  imports: [],
  templateUrl: './room-hub.html',
  styleUrl: './room-hub.css'
})
export class RoomHub  implements OnInit {
  roomId: string | null = null;
  username: string | null = null;
  password: string | null = null;
  players: string[] = [];

  private hubConnection!: HubConnection;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {    }

  ngOnInit() {

    this.roomId = this.route.snapshot.queryParamMap.get('roomId');
    this.username = this.route.snapshot.queryParamMap.get('username');
    this.password = this.route.snapshot.queryParamMap.get('password');

    if (!this.roomId)  {
      return
    };

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`http://localhost:8000/api/hub?roomId=${this.roomId}&username=${this.username}&password=${this.password}`)
      .build();

    this.hubConnection.on('UpdatePlayers', (players: string[]) => {
      this.players = players;
      this.cdr.detectChanges();
    });

    this.hubConnection.start().catch(err => console.error('SignalR error:', err));
  }
}
