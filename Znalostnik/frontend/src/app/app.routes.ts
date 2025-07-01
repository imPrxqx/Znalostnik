import { Routes } from '@angular/router';
import { Home } from './layout/main/home/home';
import { CreateRoom } from './layout/main/rooms/create-room/create-room';
import { JoinRoom } from './layout/main/rooms/join-room/join-room';
import { RoomHub } from './layout/main/rooms/room-hub/room-hub';
import { UserAuthentication } from './layout/main/login/user-authentication/user-authentication';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'create-room',
    component: CreateRoom,
  },
  {
    path: 'join-room',
    component: JoinRoom,
  },
  {
    path: 'room-hub',
    component: RoomHub,
  },
  {
    path: 'user-authentication',
    component: UserAuthentication,
  },
];
