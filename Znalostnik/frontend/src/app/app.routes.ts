import { Routes } from '@angular/router';
import { ExerciseEditor } from '@features/exercise-editor/components/exercise-editor/exercise-editor';
import { Home } from '@features/home/home';
import { MainLayout } from '@shared/components/main-layout/main-layout';
import { Dashboard } from '@features/dashboard/dashboard';
import { Account } from '@features/account/account';
import { Profile } from '@features/account/profile/profile';
import { Settings } from '@features/account/settings/settings';
import { Preferences } from '@features/account/preferences/preferences';
import { Authentication } from '@features/authentication/authentication';
import { Register } from '@features/authentication/register/register';
import { Login } from '@features/authentication/login/login';
import { MyExercises } from '@features/dashboard/my-exercises/my-exercises';
import { MySessions } from '@features/dashboard/my-sessions/my-sessions';
import { GetReady } from '@features/session/get-ready/get-ready';
import { Join } from '@features/session/join/join';
import { Participant } from '@features/session/participant/participant';
import { Host } from '@features/session/host/host';
export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [{ path: '', component: Home }],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'my-exercises', pathMatch: 'full' },
      { path: 'my-exercises', component: MyExercises },
      { path: 'my-sessions', component: MySessions },
    ],
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
    path: 'session',
    children: [
      { path: '', redirectTo: 'join', pathMatch: 'full' },
      { path: 'get-ready', component: GetReady },
      { path: ':id/participant', component: Participant },
      { path: ':id/host', component: Host },
      { path: 'join', component: Join },
    ],
  },
  {
    path: 'exercise-editor/:id',
    component: ExerciseEditor,
  },
];
