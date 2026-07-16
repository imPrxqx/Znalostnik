import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionState } from '../services/session-state';

/**
 * Provides a form for joining on session.
 */
@Component({
  selector: 'app-join',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './join.html',
  styleUrl: './join.scss',
})
export class Join {
  session = inject(SessionState);

  joinForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const code = this.joinForm.value.code as string;
    const username = this.joinForm.value.username as string;
    this.session.joinSession(code, username);
  }
}
