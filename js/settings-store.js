/* ============================================================
   Accordo — Persistance locale
   Classe statique : lecture/écriture brute de localStorage.
   La validation des valeurs est faite par App.
   ============================================================ */
"use strict";

class SettingsStore {
  static KEY_SETTINGS = "accordo";
  static KEY_CUSTOM = "accordo-custom";

  // -> objet de réglages ou null (absent / corrompu / stockage indisponible)
  static readSettings() {
    try {
      const raw = localStorage.getItem(SettingsStore.KEY_SETTINGS);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  static writeSettings(obj) {
    try { localStorage.setItem(SettingsStore.KEY_SETTINGS, JSON.stringify(obj)); }
    catch (_) {}
  }

  // -> tableau d'accordages persos (toujours un tableau)
  static readCustomTunings() {
    try {
      const raw = localStorage.getItem(SettingsStore.KEY_CUSTOM);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (_) { return []; }
  }

  static writeCustomTunings(arr) {
    try { localStorage.setItem(SettingsStore.KEY_CUSTOM, JSON.stringify(arr)); }
    catch (_) {}
  }
}
