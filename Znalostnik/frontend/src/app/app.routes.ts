import { Routes } from '@angular/router';
import { ExerciseEditor } from '@features/exercise-editor/components/exercise-editor/exercise-editor';
import { Home } from '@pages/home/home';
import { CreateRoom } from '@features/rooms/components/create-room/create-room';
import { JoinRoom } from '@features/rooms/components/join-room/join-room';
import { RoomHub } from '@features/rooms/components/room-hub/room-hub';
import { Logout } from '@features/authentication/components/logout/logout';

import { Canvas } from '@features/editor/components/canvas/canvas';
import { ExerciseTest } from '@features/editor/components/exercise-test/exercise-test';
import { MainLayout } from '@shared/components/main-layout/main-layout';
import { Dashboard } from '@pages/dashboard/dashboard';
import { Account } from '@pages/account/account';
import { Profile } from '@pages/account/profile/profile';
import { Settings } from '@pages/account/settings/settings';
import { Preferences } from '@pages/account/preferences/preferences';
import { Authentication } from '@pages/authentication/authentication';
import { Register } from '@pages/authentication/register/register';
import { Login } from '@pages/authentication/login/login';
export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [{ path: '', component: Home }],
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'account',
    component: Account,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings },
      { path: 'preferences', component: Preferences },
    ],
  },
  {
    path: 'authentication',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
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
    path: 'exercise-editor',
    component: ExerciseEditor,
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
    path: 'logout',
    component: Logout,
  },
  {
    path: 'session',
    component: JoinRoom,
  },
];
