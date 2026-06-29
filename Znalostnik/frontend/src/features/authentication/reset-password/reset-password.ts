import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from '@core/services/authentication';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
  auth = inject(Authentication);
  route = inject(Router);
  routeActivated = inject(ActivatedRoute);

  email = '';
  resetCode = '';

  resetForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.email = this.routeActivated.snapshot.queryParamMap.get('email')!;
    this.resetCode = this.routeActivated.snapshot.queryParamMap.get('token')!;

    if (!this.email || !this.resetCode) {
      this.route.navigate(['/authentication/forgot-password']);
    }
  }

  onSubmit() {
    const newPassword = this.resetForm.value.newPassword;
    const confirmPassword = this.resetForm.value.confirmPassword;

    if (newPassword !== confirmPassword) {
      this.resetForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return;
    }

    this.auth
      .resetPassword(this.email, this.resetCode, this.resetForm.value.newPassword!)
      .subscribe({
        next: () => {
          this.route.navigate(['/authentication/login']);
        },
        error: () => {
          this.route.navigate(['/authentication/login']);
        },
      });
  }
}
