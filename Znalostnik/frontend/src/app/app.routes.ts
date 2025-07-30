import { Routes } from '@angular/router';
import { Home } from './layout/main/home/components/home';
import { CreateRoom } from './layout/main/rooms/components/create-room/create-room';
import { JoinRoom } from './layout/main/rooms/components/join-room/join-room';
import { RoomHub } from './layout/main/rooms/components/room-hub/room-hub';
import { Account } from './layout/main/authentication/components/account/account';
import { Login } from './layout/main/authentication/components/login/login';
import { Logout } from './layout/main/authentication/components/logout/logout';
import { Register } from './layout/main/authentication/components/register/register';
import { ResetPassword } from './layout/main/authentication/components/reset-password/reset-password';
import { ForgotPassword } from './layout/main/authentication/components/forgot-password/forgot-password';

import { Editor } from './layout/main/editor/components/editor';
import { ExerciseTest } from './layout/main/editor/components/exercise-test/exercise-test';
export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'exercise-test',
    component: ExerciseTest,
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
