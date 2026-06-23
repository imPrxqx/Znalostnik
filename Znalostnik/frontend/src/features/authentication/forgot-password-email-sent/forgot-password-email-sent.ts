import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-forgot-password-email-sent',
  imports: [RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './forgot-password-email-sent.html',
  styleUrl: './forgot-password-email-sent.scss',
})
export class ForgotPasswordEmailSent {}
