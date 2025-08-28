import { Routes } from '@angular/router';
import { Home } from '../features/home/components/home';
import { CreateRoom } from '../features/rooms/components/create-room/create-room';
import { JoinRoom } from '../features/rooms/components/join-room/join-room';
import { RoomHub } from '../features/rooms/components/room-hub/room-hub';
import { Account } from '../features/authentication/components/account/account';
import { Login } from '../features/authentication/components/login/login';
import { Logout } from '../features/authentication/components/logout/logout';
import { Register } from '../features/authentication/components/register/register';
import { ResetPassword } from '../features/authentication/components/reset-password/reset-password';
import { ForgotPassword } from '../features/authentication/components/forgot-password/forgot-password';

import { Canvas } from '../features/editor/components/canvas/canvas';
import { ExerciseTest } from '../features/editor/components/exercise-test/exercise-test';
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
    component: Canvas,
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
