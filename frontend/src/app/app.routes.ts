import { Routes } from '@angular/router';
import { ExerciseEditor } from '@features/exercise-editor/components/exercise-editor/exercise-editor';
import { Home } from '@features/dashboard/home/home';
import { Dashboard } from '@features/dashboard/dashboard';
import { Authentication } from '@features/authentication/authentication';
import { Register } from '@features/authentication/register/register';
import { Login } from '@features/authentication/login/login';
import { MyExercises } from '@features/dashboard/my-exercises/my-exercises';
import { MySessions } from '@features/dashboard/my-sessions/my-sessions';
import { Participant } from '@features/session/participant/participant';
import { Host } from '@features/session/host/host';
import { Lobby } from '@features/session/lobby/lobby';
import { ForgotPassword } from '@features/authentication/forgot-password/forgot-password';
import { ResetPassword } from '@features/authentication/reset-password/reset-password';
import { ForgotPasswordEmailSent } from '@features/authentication/forgot-password-email-sent/forgot-password-email-sent';
import { Report } from '@features/dashboard/my-statistics/report/report';
import { MySettings } from '@features/dashboard/my-settings/my-settings';
import { MyStatistics } from '@features/dashboard/my-statistics/my-statistics';
import { Guide } from '@features/dashboard/guide/guide';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'my-exercises', component: MyExercises },
      { path: 'my-sessions', component: MySessions },
      { path: 'my-settings', component: MySettings },
      { path: 'my-statistics', component: MyStatistics },
      { path: 'my-statistics/:id', component: MyStatistics },
      { path: 'guide', component: Guide },
    ],
  },
  {
    path: 'authentication',
    component: Authentication,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'forgot-password', component: ForgotPassword },
      { path: 'forgot-password-email-sent', component: ForgotPasswordEmailSent },
      { path: 'reset-password', component: ResetPassword },
    ],
  },
  {
    path: 'session',
    children: [
      { path: '', redirectTo: 'join', pathMatch: 'full' },
      { path: ':id/lobby', component: Lobby },
      { path: ':id/participant', component: Participant },
      { path: ':id/host', component: Host },
    ],
  },
  {
    path: 'exercise-editor/:id',
    component: ExerciseEditor,
  },
  {
    path: 'session-report/:id',
    component: Report,
  },
];
