import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserPreferences } from '@core/services/user-preferences';

@Component({
  selector: 'app-preferences',
  imports: [
    MatExpansionModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],

  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {
  private prefs = inject(UserPreferences);

  form = new FormGroup({
    language: new FormControl('en'),
    theme: new FormControl('light'),
  });

  ngOnInit() {
    const prefs = this.prefs.getPreferences();

    this.form.patchValue({
      language: prefs.language,
      theme: prefs.theme,
    });
  }

  save() {
    const value = this.form.value;
    this.prefs.updatePreferences({
      language: (value.language ?? 'en') as 'en' | 'cs',
      theme: (value.theme ?? 'light') as 'light' | 'dark',
    });
  }
}
