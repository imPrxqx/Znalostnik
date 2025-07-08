import { Component, OnInit  } from '@angular/core';
import { Room } from '../../services/room';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-hub',
  imports: [CommonModule],
  templateUrl: './room-hub.html',
  styleUrl: './room-hub.css'
})
export class RoomHub {
  roomId: string | null = null;
  username: string | null = null;
  password: string | null = null;
  players$: Observable<string[]>;

  constructor(private roomService: Room) {
    this.players$ = this.roomService.players$;
  }
}
