import { Component, OnInit, signal } from '@angular/core';
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
  errorTimeoutId: any;
  constructor(
    private roomService: Room,
    private router: Router,
  ) {}

  errorMessage = signal<boolean>(false);

  async joinRoom() {
    this.roomService.joinRoom(this.roomId, this.password, this.username).subscribe({
      next: (data) => {
        console.log('Join success:', data);
        this.errorMessage.set(false);
        this.router.navigate(['/room-hub']);
      },
      error: async (err) => {
        this.errorMessage.set(true);
        console.error('Join failed:', err);
        this.errorMessage.set(false);
      },
    });
  }

  ngOnInit() {
    this.roomService.connectionAccepted$.subscribe(() => {
      this.router.navigate(['/room-hub']);
    });

    this.roomService.connectionRejected$.subscribe((msg) => {
      this.errorMessage.set(true);
      console.log('Join failed:');

      if (this.errorTimeoutId) {
        clearTimeout(this.errorTimeoutId);
      }

      this.errorTimeoutId = setTimeout(() => {
        this.errorMessage.set(false);
        this.errorTimeoutId = null;
      }, 3000);
    });
  }
}
