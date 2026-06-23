import { RouterModule, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from '@core/services/authentication';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  auth = inject(Authentication);
  route = inject(Router);

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    const email = this.forgotForm.value.email!;
    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.route.navigate(['/authentication/forgot-password-email-sent']);
      },
    });
  }
}
