import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-join-room',
  imports: [FormsModule, CommonModule],
  templateUrl: './join-room.html',
  styleUrl: './join-room.css',
})

export class JoinRoom {
  constructor(private cdr: ChangeDetectorRef) {}

  timerCancelToken: number = 0;

  username: string = '';
  room: string = '';
  password: string = '';

  joinRoomFailed: boolean = false;
  submitted: boolean = false;

  async joinRoom() {
    this.joinRoomFailed = false;
    this.cdr.detectChanges();
    const currentToken = this.timerCancelToken + 1;
    this.joinRoomFailed = true;
    this.cdr.detectChanges();

    await delay(4000);

    if (currentToken === this.timerCancelToken) {
      this.joinRoomFailed = false;
      this.cdr.detectChanges();
    }
  }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
