import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-create-room',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-room.html',
  styleUrl: './create-room.css'
})
export class CreateRoom {
  
  constructor(private cdr: ChangeDetectorRef) {}

  timerCancelToken: number = 0;

  username: string = '';
  room: string = '';
  password: string = '';
  createRoomFailed: boolean = false;

  async createRoom() { 

    this.createRoomFailed = false;
    this.cdr.detectChanges();
    const currentToken = this.timerCancelToken + 1;
    this.createRoomFailed = true;
    this.cdr.detectChanges();

    await delay(4000);

    if (currentToken === this.timerCancelToken) {
      this.createRoomFailed = false;
      this.cdr.detectChanges();
    }
  }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
