import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Room } from '../../services/room';

@Component({
  selector: 'app-create-room',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-room.html',
  styleUrl: './create-room.css'
})
export class CreateRoom {

  createRoomFailed: boolean = false;
  createRoomSuccess: boolean = false;
  roomId: string | null = null;
  password: string | null = null;
  roomService: Room;

  constructor(roomService: Room) {
    this.roomService = roomService;
  }


  createRoom() { 
    this.createRoomSuccess = false;
    this.createRoomFailed = false;

    this.roomService.createRoom().subscribe({

      next: data => {
        console.log('Create room success:', data);
        this.createRoomSuccess = true;
        this.roomId = data.roomId;
        this.password = data.password;
      },
      error: async err => {
        console.error('Create room failed:', err);
        this.createRoomFailed = true;
      },
    });
  }
}
