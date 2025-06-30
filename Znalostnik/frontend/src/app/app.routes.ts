import { Routes } from '@angular/router';
import { Home } from './layout/main/home/home';
import { CreateRoom } from './layout/main/create-room/create-room';
import { JoinRoom } from './layout/main/join-room/join-room';
import { UserAuthentication } from './layout/main/user-authentication/user-authentication';

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
    path: 'user-authentication',
    component: UserAuthentication,
  },
];
