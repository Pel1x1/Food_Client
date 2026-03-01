import { makeAutoObservable } from 'mobx';

export type Theme = 'light' | 'dark';

class ThemeStore {
  theme: Theme = 'light';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    const saved =
      (typeof window !== 'undefined' &&
        (localStorage.getItem('theme') as Theme | null)) ||
      null;

    if (saved === 'dark' || saved === 'light') {
      this.theme = saved;
    } else if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ) {
      this.theme = 'dark';
    }

    this.applyTheme();
  }

  private applyTheme() {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('theme-dark', this.theme === 'dark');
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }
}

export const themeStore = new ThemeStore();

