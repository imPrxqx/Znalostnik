import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Room } from '../../services/room';
import { signal } from '@angular/core';

@Component({
  selector: 'app-create-room',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-room.html',
  styleUrl: './create-room.css',
})
export class CreateRoom {
  createRoomFailed = signal<boolean>(false);
  createRoomSuccess = signal<boolean>(false);
  roomId: string | null = null;
  password: string | null = null;
  roomService: Room;

  constructor(roomService: Room) {
    this.roomService = roomService;
  }

  createRoom() {
    this.createRoomSuccess.set(false);
    this.createRoomFailed.set(false);

    this.roomService.createRoom().subscribe({
      next: (data) => {
        console.log('Create room success:', data);
        this.roomId = data.roomId;
        this.password = data.password;
        this.createRoomSuccess.set(true);
      },
      error: async (err) => {
        console.error('Create room failed:', err);
        this.createRoomFailed.set(true);
      },
    });
  }
}
