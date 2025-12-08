import { Injectable, signal, computed } from '@angular/core';

export interface PreferenceData {
  language: 'cs' | 'en';
  theme: 'light' | 'dark';
}

@Injectable({
  providedIn: 'root',
})
export class Preference {
  private userPreferences = signal<PreferenceData>({
    language: 'en',
    theme: 'dark',
  });

  language = computed(() => this.userPreferences().language);
  theme = computed(() => this.userPreferences().theme);

  constructor() {
    this.loadLocal();
    this.applyTheme(this.userPreferences().theme);
  }

  updatePreferences(newPreferences: PreferenceData) {
    const old = this.userPreferences();

    const merged: { language: 'cs' | 'en'; theme: 'light' | 'dark' } = {
      ...old,
      ...newPreferences,
    };
    this.userPreferences.set(merged);

    if (newPreferences.language && newPreferences.language !== old.language) {
      this.applyLanguage(newPreferences.language);
    }

    if (newPreferences.theme && newPreferences.theme !== old.theme) {
      this.applyTheme(newPreferences.theme);
    }

    this.saveLocal();
  }

  applyLanguage(language: 'cs' | 'en') {
    document.documentElement.setAttribute('language', language);
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${language}/${currentPath}`;
  }

  applyTheme(theme: 'light' | 'dark') {
    const body = document.body;
    body.classList.remove('light-mode');
    body.classList.remove('dark-mode');

    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else if (theme === 'light') {
      body.classList.add('light-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  getPreferences(): PreferenceData {
    return this.userPreferences();
  }

  private loadLocal() {
    const preferences = localStorage.getItem('preferences');

    if (!preferences) {
      return;
    }

    const prefs = JSON.parse(preferences);
    this.userPreferences.set(prefs);
  }

  private saveLocal() {
    localStorage.setItem('preferences', JSON.stringify(this.userPreferences()));
  }
}
