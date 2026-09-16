import { Preferences } from '@capacitor/preferences';

const THEME_KEY = 'galeria-foto:dark-mode';

export async function getDarkMode(): Promise<boolean> {
  const { value } = await Preferences.get({ key: THEME_KEY });
  return value === 'true';
}

export async function setDarkMode(enabled: boolean): Promise<void> {
  document.documentElement.classList.toggle('ion-palette-dark', enabled);
  await Preferences.set({ key: THEME_KEY, value: String(enabled) });
}

export async function restoreTheme(): Promise<void> {
  document.documentElement.classList.toggle('ion-palette-dark', await getDarkMode());
}
