import { Routes } from '@angular/router';
import { Home } from './layout/main/home/home';
import { CreateRoom } from './layout/main/rooms/create-room/create-room';
import { JoinRoom } from './layout/main/rooms/join-room/join-room';
import { RoomHub } from './layout/main/rooms/room-hub/room-hub';
import { Account } from './layout/main/authentication/account/account';
import { Login } from './layout/main/authentication/login/login';
import { Logout } from './layout/main/authentication/logout/logout';
import { Register } from './layout/main/authentication/register/register';
import { ResetPassword } from './layout/main/authentication/reset-password/reset-password';
import { ForgotPassword } from './layout/main/authentication/forgot-password/forgot-password';

import { Editor } from './layout/main/editor/editor';

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
    path: 'editor',
    component: Editor,
  },
  {
    path: 'room-hub',
    component: RoomHub,
  },
  {
    path: 'account',
    component: Account,
  },  
  {
    path: 'login',
    component: Login,
  },  
  {
    path: 'logout',
    component: Logout,
  },  
  {
    path: 'register',
    component: Register,
  },  
  {
    path: 'reset-password',
    component: ResetPassword,
  },  
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
];
