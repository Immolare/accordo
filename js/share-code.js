/* ============================================================
   Accordo — Codes de partage d'accordages
   Classe statique. Format : G|B + nb cordes + paires
   note-octave (dièses) + ":" + nom encodé.
   Ex. G6C#2G#2C#3F#3A#3D#4:M%C3%A9tal
   Dépend de : Music.
   ============================================================ */
"use strict";

class ShareCode {
  // Lien de partage canonique. Le code est entièrement encodé : les dièses
  // (#) et les % du nom casseraient le fragment d'URL sinon.
  static BASE = "https://accordo.tools/";

  static generate(instrument, notes, name) {
    const instChar = instrument === "guitar" ? "G" : "B";
    const noteStr = notes.map(m => {
      const { noteIdx, oct } = Music.midiToNoteOctave(m);
      return Music.NOTES[noteIdx] + oct;
    }).join("");
    const encodedName = encodeURIComponent(name);
    return instChar + notes.length + noteStr + ":" + encodedName;
  }

  static url(code) {
    return ShareCode.BASE + "#" + encodeURIComponent(code);
  }

  // Accepte indifféremment un code brut, un code encodé ou un lien complet.
  static extract(text) {
    let s = String(text || "").trim();
    const h = s.indexOf("#");
    if (h !== -1 && /^https?:\/\/|^accordo\.tools/i.test(s)) s = s.slice(h + 1);
    // Variante décodée essayée en premier : un code encodé pour URL peut
    // aussi parser « par accident » en perdant le nom (%3A non reconnu)
    try {
      const dec = decodeURIComponent(s);
      if (dec !== s && ShareCode.parse(dec)) return dec;
    } catch (_) {}
    return s;
  }

  // Version lisible d'un code pour l'affichage dans l'appli (nom décodé,
  // ex. « :Métal » au lieu de « :M%C3%A9tal »). Reste importable telle
  // quelle ; le partage web passe lui par ShareCode.url (lien encodé).
  static readable(code) {
    const sep = code.indexOf(":");
    if (sep === -1) return code;
    try { return code.slice(0, sep + 1) + decodeURIComponent(code.slice(sep + 1)); }
    catch (_) { return code; }
  }

  // -> { instrument, notes, name } ou null si invalide
  static parse(code) {
    if (!code || typeof code !== "string") return null;
    let i = 0;
    const ch = code[i];
    if (ch !== "G" && ch !== "B") return null;
    const instrument = ch === "G" ? "guitar" : "bass";
    i++;
    let countStr = "";
    while (i < code.length && /[0-9]/.test(code[i])) { countStr += code[i]; i++; }
    const count = parseInt(countStr, 10);
    if (isNaN(count) || count < 1 || count > 20) return null;
    const notes = [];
    for (let j = 0; j < count; j++) {
      if (i >= code.length) return null;
      const letter = code[i].toUpperCase();
      if (!/[A-G]/.test(letter)) return null;
      i++;
      let sharp = false;
      if (i < code.length && code[i] === "#") { sharp = true; i++; }
      if (i >= code.length || !/[0-9]/.test(code[i])) return null;
      const oct = parseInt(code[i], 10);
      i++;
      const noteName = letter + (sharp ? "#" : "");
      const noteIdx = Music.NOTES.indexOf(noteName);
      if (noteIdx === -1) return null;
      notes.push(Music.noteOctaveToMIDI(noteIdx, oct));
    }
    let name = "";
    if (i < code.length && code[i] === ":") {
      i++;
      // decodeURIComponent lève sur un % malformé (lien tronqué…) : on
      // retombe sur le texte brut plutôt que de faire échouer tout l'import
      const rawName = code.slice(i);
      try { name = decodeURIComponent(rawName); } catch (_) { name = rawName; }
      name = name.slice(0, 80);
    }
    return { instrument, notes, name };
  }
}
