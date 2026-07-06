/* ============================================================
   Accordo — Données musicales & théorie
   Classe statique : notes, presets d'accordages, constantes et
   conversions MIDI pures (aucune dépendance à l'application).
   ============================================================ */
"use strict";

class Music {
  static NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  static NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  // Notes en numéros MIDI (A4 = 69). Ordre : corde la plus grave -> la plus aiguë.
  // "group" : nombre de cordes (libellé localisé). "nameKey" : nom traduit via i18n.
  static PRESETS = {
    guitar: [
      // --- 6 cordes : standards ---
      { group: 6, name: "Standard E",     notes: [40, 45, 50, 55, 59, 64] },
      { group: 6, name: "Standard Eb",    notes: [39, 44, 49, 54, 58, 63] },
      { group: 6, name: "Standard D",     notes: [38, 43, 48, 53, 57, 62] },
      { group: 6, name: "Standard C#",    notes: [37, 42, 47, 52, 56, 61] },
      { group: 6, name: "Standard C",     notes: [36, 41, 46, 51, 55, 60] },
      { group: 6, name: "Standard B",     notes: [35, 40, 45, 50, 54, 59] },
      // --- 6 cordes : drops ---
      { group: 6, name: "Drop D",         notes: [38, 45, 50, 55, 59, 64] },
      { group: 6, name: "Drop C#",        notes: [37, 44, 49, 54, 58, 63] },
      { group: 6, name: "Drop C",         notes: [36, 43, 48, 53, 57, 62] },
      { group: 6, name: "Drop B",         notes: [35, 42, 47, 52, 56, 61] },
      { group: 6, name: "Drop A#",        notes: [34, 41, 46, 51, 55, 60] },
      { group: 6, name: "Drop A",         notes: [33, 40, 45, 50, 54, 59] },
      // --- 6 cordes : open ---
      { group: 6, name: "Open G",         notes: [38, 43, 50, 55, 59, 62] },
      { group: 6, name: "Open A",         notes: [40, 45, 52, 57, 61, 64] },
      { group: 6, name: "Open C",         notes: [36, 43, 48, 55, 60, 64] },
      { group: 6, name: "Open D",         notes: [38, 45, 50, 54, 57, 62] },
      { group: 6, nameKey: "openDm",      notes: [38, 45, 50, 53, 57, 62] },
      { group: 6, name: "Open E",         notes: [40, 47, 52, 56, 59, 64] },
      // --- 6 cordes : autres ---
      { group: 6, name: "DADGAD",         notes: [38, 45, 50, 55, 57, 62] },
      { group: 6, name: "Double Drop D",  notes: [38, 45, 50, 55, 59, 62] },
      { group: 6, nameKey: "fourths",     notes: [40, 45, 50, 55, 60, 65] },
      // --- 7 cordes ---
      { group: 7, name: "Standard B",     notes: [35, 40, 45, 50, 55, 59, 64] },
      { group: 7, name: "Standard A#",    notes: [34, 39, 44, 49, 54, 58, 63] },
      { group: 7, name: "Standard A",     notes: [33, 38, 43, 48, 53, 57, 62] },
      { group: 7, name: "Standard G#",    notes: [32, 37, 42, 47, 52, 56, 61] },
      { group: 7, name: "Drop A",         notes: [33, 40, 45, 50, 55, 59, 64] },
      { group: 7, name: "Drop G#",        notes: [32, 39, 44, 49, 54, 58, 63] },
      { group: 7, name: "Drop G",         notes: [31, 38, 43, 48, 53, 57, 62] },
      { group: 7, name: "Drop F#",        notes: [30, 37, 42, 47, 52, 56, 61] },
      // --- 8 cordes ---
      { group: 8, name: "Standard F#",    notes: [30, 35, 40, 45, 50, 55, 59, 64] },
      { group: 8, name: "Standard F",     notes: [29, 34, 39, 44, 49, 54, 58, 63] },
      { group: 8, name: "Standard E",     notes: [28, 33, 38, 43, 48, 53, 57, 62] },
      { group: 8, name: "Drop E",         notes: [28, 35, 40, 45, 50, 55, 59, 64] },
      { group: 8, name: "Drop D#",        notes: [27, 34, 39, 44, 49, 54, 58, 63] },
      { group: 8, name: "Drop D",         notes: [26, 33, 38, 43, 48, 53, 57, 62] },
    ],
    bass: [
      // --- 4 cordes : standards ---
      { group: 4, name: "Standard E",     notes: [28, 33, 38, 43] },
      { group: 4, name: "Standard Eb",    notes: [27, 32, 37, 42] },
      { group: 4, name: "Standard D",     notes: [26, 31, 36, 41] },
      { group: 4, name: "Standard C#",    notes: [25, 30, 35, 40] },
      { group: 4, name: "Standard C",     notes: [24, 29, 34, 39] },
      // --- 4 cordes : drops ---
      { group: 4, name: "Drop D",         notes: [26, 33, 38, 43] },
      { group: 4, name: "Drop C#",        notes: [25, 32, 37, 42] },
      { group: 4, name: "Drop C",         notes: [24, 31, 36, 41] },
      { group: 4, name: "Drop B",         notes: [23, 30, 35, 40] },
      { group: 4, name: "Drop A#",        notes: [22, 29, 34, 39] },
      // --- 5 cordes ---
      { group: 5, name: "Standard B",     notes: [23, 28, 33, 38, 43] },
      { group: 5, name: "Standard A",     notes: [21, 26, 31, 36, 41] },
      { group: 5, nameKey: "highC",       notes: [28, 33, 38, 43, 48] },
      { group: 5, name: "Drop A",         notes: [21, 28, 33, 38, 43] },
      { group: 5, name: "Drop G",         notes: [19, 26, 31, 36, 41] },
      // --- 6 cordes ---
      { group: 6, name: "Standard B",     notes: [23, 28, 33, 38, 43, 48] },
      { group: 6, name: "Standard A",     notes: [21, 26, 31, 36, 41, 46] },
      { group: 6, name: "Drop A",         notes: [21, 28, 33, 38, 43, 48] },
    ],
  };

  static IN_TUNE_CENTS = 5;      // tolérance "juste"
  static HOLD_MS = 1000;         // durée de maintien pour valider une corde
  static CALIB_MIN = 415;
  static CALIB_MAX = 465;

  // Nombre minimal de cordes par instrument (guitare 6, basse 4)
  static minStrings(instrument) {
    return instrument === "bass" ? 4 : 6;
  }

  /* ---------------- Conversions pures ---------------- */

  static midiOctave(m) { return Math.floor(m / 12) - 1; }

  static noteOctaveToMIDI(noteIdx, oct) {
    return noteIdx + (oct + 1) * 12;
  }

  static midiToNoteOctave(m) {
    return { noteIdx: ((m % 12) + 12) % 12, oct: Music.midiOctave(m) };
  }

  static centsOff(freq, target) { return 1200 * Math.log2(freq / target); }

  // "1st", "2nd", "3rd", "4th"…
  static ordinal(n) {
    n = Number(n);
    if (isNaN(n)) return "";
    if (n >= 11 && n <= 13) return n + "th";
    switch (n % 10) {
      case 1: return n + "st";
      case 2: return n + "nd";
      case 3: return n + "rd";
      default: return n + "th";
    }
  }
}
