import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { Room } from '../../services/room';

@Component({
  selector: 'app-join-room',
  imports: [FormsModule, CommonModule],
  templateUrl: './join-room.html',
  styleUrl: './join-room.css',
})

export class JoinRoom implements OnInit {  
  roomId: string = '';
  password: string = '';
  username: string = '';

  constructor( private roomService: Room, private router: Router) {}

  joinRoomFailed: boolean = false;

  joinRoom() {
    this.roomService.joinRoom(this.roomId, this.password, this.username).subscribe({
      next: data => {
        console.log('Join success:', data);
        this.router.navigate(['/room-hub']);
      },
      error: async err => {
        console.error('Join failed:', err);
      },
    });
  }

  ngOnInit() {
    this.roomService.connectionAccepted$.subscribe(() => {
      this.router.navigate(['/room-hub']);
    });

    this.roomService.connectionRejected$.subscribe((msg) => {
        console.log('Join failed:', msg);
    });
  }

}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
