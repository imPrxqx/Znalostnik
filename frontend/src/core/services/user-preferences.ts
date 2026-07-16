import { Injectable, signal, computed } from '@angular/core';

export interface PreferenceData {
  language: 'cs' | 'en';
  theme: 'light' | 'dark';
}

/**
 * Manages and saves user preferences such as language and theme settings.
 */
@Injectable({
  providedIn: 'root',
})
export class UserPreferences {
  private userPreferences = signal<PreferenceData>({
    language: 'en',
    theme: 'light',
  });

  language = computed(() => this.userPreferences().language);
  theme = computed(() => this.userPreferences().theme);

  constructor() {
    // Initialize user preferences from storage and apply them to the application.
    this.loadLocal();
    this.applyLanguageRouting(this.userPreferences().language);
    this.applyTheme(this.userPreferences().theme);
  }

  /**
   * Updates new preferences to local storage.
   */
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

  /**
   * Apply new langueage in application.
   */
  applyLanguage(language: 'cs' | 'en') {
    document.documentElement.setAttribute('language', language);
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${language}/${currentPath}`;
  }

  /**
   * Apply new theme in application.
   */
  applyTheme(theme: 'light' | 'dark') {
    const body = document.body;
    body.classList.remove('light-mode');
    body.classList.remove('dark-mode');

    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else if (theme === 'light') {
      body.classList.add('light-mode');
    }
  }

  /**
   * Apply correct url language loaded in preferences.
   */
  applyLanguageRouting(language: 'cs' | 'en') {
    const pathParts = window.location.pathname.split('/').filter((x) => x !== '');
    const urlLanguage = pathParts[0];

    if (urlLanguage !== 'cs' && urlLanguage !== 'en') {
      return;
    }

    if (urlLanguage === language) {
      return;
    }

    const newPath = pathParts.slice(1).join('/');
    window.location.assign(`/${language}/${newPath}`);
  }

  /**
   * Returns user current preferences.
   */
  getPreferences(): PreferenceData {
    return this.userPreferences();
  }

  /**
   * Loads user current preferences saved on local storage.
   */
  loadLocal() {
    const preferences = localStorage.getItem('preferences');

    if (!preferences) {
      return;
    }

    const prefs = JSON.parse(preferences);
    this.userPreferences.set(prefs);
  }

  /**
   * Saves user current preferences to local storage.
   */
  saveLocal() {
    localStorage.setItem('preferences', JSON.stringify(this.userPreferences()));
  }
}
