import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Authentication } from '@core/services/authentication';
import { UserPreferences } from '@core/services/user-preferences';

/**
 * Provides user updating user preferences, password change or account deletion
 */
@Component({
  selector: 'app-my-settings',
  imports: [
    MatExpansionModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './my-settings.html',
  styleUrl: './my-settings.scss',
})
export class MySettings implements OnInit {
  prefs = inject(UserPreferences);
  auth = inject(Authentication);

  newPreferenceForm = new FormGroup({
    language: new FormControl('en', [Validators.required]),
    theme: new FormControl('light', [Validators.required]),
  });

  newPasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
    ]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    const prefs = this.prefs.getPreferences();
    this.newPreferenceForm.controls['language'].setValue(prefs.language);
    this.newPreferenceForm.controls['theme'].setValue(prefs.theme);
  }

  updatePreferences() {
    const value = this.newPreferenceForm.value;
    this.prefs.updatePreferences({
      language: (value.language ?? 'en') as 'en' | 'cs',
      theme: (value.theme ?? 'light') as 'light' | 'dark',
    });
  }

  updatePassword() {
    const oldPassword = this.newPasswordForm.value.currentPassword;
    const newPassword = this.newPasswordForm.value.newPassword;

    if (newPassword !== this.newPasswordForm.value.confirmNewPassword) {
      this.newPasswordForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return;
    }

    this.auth.updatePassword(oldPassword!, newPassword!).subscribe({
      error: (error) => {
        if (error.status === 400) {
          this.newPasswordForm.get('currentPassword')?.setErrors({ currentPasswordInvalid: true });
        }
      },
    });
  }

  deleteAccount() {
    if (!confirm('Opravdu chceš smazat účet? Tato akce je nevratná.')) {
      return;
    }

    this.auth.deleteAccount();
  }
}
