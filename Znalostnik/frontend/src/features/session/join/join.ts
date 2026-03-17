import { RouterOutlet, RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SessionState } from '../services/session-state';

@Component({
  selector: 'app-join',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    RouterModule,
    MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    CommonModule,
  ],
  templateUrl: './join.html',
  styleUrl: './join.scss',
})
export class Join {
  session = inject(SessionState);

  joinForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const code = this.joinForm.value.code as string;
    this.session.joinSession(code);
  }
}
