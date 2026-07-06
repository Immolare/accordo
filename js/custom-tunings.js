/* ============================================================
   Accordo — Accordages personnalisés
   Feuille de création/édition, import par code ou lien,
   deep linking (#code dans l'URL).
   Dépend de : Music, ShareCode, UI, App (injectée).
   ============================================================ */
"use strict";

class CustomTunings {
  // Identifiant court unique pour un nouvel accordage
  static newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  constructor(app) {
    this.app = app;
    // Accordage en cours d'édition dans la feuille (null = création).
    // Renseigné aussi après une création : re-sauver modifie au lieu de dupliquer.
    this.editingId = null;
  }

  renderSheet(editTuning) {
    const { app } = this;
    const el = app.ui.el;
    const state = app.state;
    this.editingId = editTuning ? editTuning.id : null;
    let src = editTuning;
    if (!src) {
      const inst = state.instrument;
      src = state.customPreset;
      if (!src) {
        const presets = Music.PRESETS[inst];
        const idx = (state.presetIndex >= 0 && state.presetIndex < presets.length) ? state.presetIndex : 0;
        src = presets[idx];
      }
    }
    if (!src || !src.notes) return;
    const rows = src.notes.map(m => {
      const { noteIdx, oct } = Music.midiToNoteOctave(m);
      return { noteIdx, oct, added: false };
    });
    this.renderStringRows(rows);
    el.customNameInput.value = editTuning ? editTuning.name : "";
    // En édition, le code de l'accordage est affiché d'emblée
    if (editTuning && editTuning.shareCode) {
      el.customShareCodeInput.value = ShareCode.readable(editTuning.shareCode);
      el.customShareCodeInput.dataset.code = editTuning.shareCode;
      el.customShareDisplay.hidden = false;
    } else {
      el.customShareDisplay.hidden = true;
      el.customShareCodeInput.value = "";
      delete el.customShareCodeInput.dataset.code;
    }
  }

  getRows() {
    const el = this.app.ui.el;
    const result = [];
    const rows = el.customStringsContainer.querySelectorAll(".custom-string-row");
    for (const row of rows) {
      const ns = row.querySelector(".custom-note-select");
      const os = row.querySelector(".custom-octave-select");
      const rm = row.querySelector(".custom-row-remove");
      const nv = parseInt(ns.value, 10);
      const ov = parseInt(os.value, 10);
      result.push({
        noteIdx: isNaN(nv) ? null : nv,
        oct: isNaN(ov) ? null : ov,
        added: !!rm,
      });
    }
    return result;
  }

  renderStringRows(rows) {
    const { app } = this;
    const c = app.ui.el.customStringsContainer;
    c.innerHTML = "";
    // Seules les cordes excédentaires (au-delà du minimum de l'instrument :
    // 6 pour guitare, 4 pour basse) sont supprimables — en priorité celles
    // ajoutées dans la session, sinon les plus graves (haut de liste)
    let removableLeft = Math.max(0, rows.length - Music.minStrings(app.state.instrument));
    const removable = rows.map(() => false);
    rows.forEach((row, i) => {
      if (removableLeft > 0 && row.added) { removable[i] = true; removableLeft--; }
    });
    rows.forEach((row, i) => {
      if (removableLeft > 0 && !removable[i]) { removable[i] = true; removableLeft--; }
    });
    // Fabrique un <select> avec placeholder désactivé + options [valeur, libellé]
    const makeSelect = (cls, placeholder, options, selectedVal) => {
      const sel = document.createElement("select");
      sel.className = cls;
      const ph = document.createElement("option");
      ph.value = "";
      ph.disabled = true;
      ph.selected = selectedVal === null;
      ph.textContent = placeholder;
      sel.appendChild(ph);
      for (const [v, txt] of options) {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = txt;
        if (selectedVal === v) opt.selected = true;
        sel.appendChild(opt);
      }
      return sel;
    };
    const noteOptions = Music.NOTES.map((nn, ni) => [ni, nn]);
    const octaveOptions = Array.from({ length: 8 }, (_, o) => [o, o]);

    rows.forEach((row, idx) => {
      const div = document.createElement("div");
      div.className = "custom-string-row";
      const label = document.createElement("span");
      label.className = "custom-string-label";
      // Données toujours grave -> aiguë (haut -> bas), mais numérotation
      // guitare standard : corde 1 = la plus aiguë (une corde grave ajoutée
      // sur une 6 cordes devient la 7e, comme sur une vraie 7 cordes)
      const pos = rows.length - idx;
      label.textContent = Music.ordinal(pos);
      label.setAttribute("data-pos", pos);
      div.appendChild(label);

      const noteSel = makeSelect("custom-note-select", "Note", noteOptions, row.noteIdx);
      const octSel = makeSelect("custom-octave-select", "Octave", octaveOptions, row.oct);
      const onChange = () => this.updateLabel(noteSel, octSel, label);
      noteSel.addEventListener("change", onChange);
      octSel.addEventListener("change", onChange);
      div.appendChild(noteSel);
      div.appendChild(octSel);

      if (removable[idx]) {
        const rmBtn = document.createElement("button");
        rmBtn.className = "custom-row-remove";
        rmBtn.innerHTML = UI.ICONS.cross;
        rmBtn.setAttribute("aria-label", "Remove");
        rmBtn.addEventListener("click", () => {
          rows.splice(idx, 1);
          this.renderStringRows(rows);
        });
        div.appendChild(rmBtn);
      }

      c.appendChild(div);
    });
  }

  updateLabel(noteSel, octSel, labelEl) {
    const nv = parseInt(noteSel.value, 10);
    const ov = parseInt(octSel.value, 10);
    const pos = labelEl.getAttribute("data-pos") || "";
    if (!isNaN(nv) && !isNaN(ov)) {
      const midi = Music.noteOctaveToMIDI(nv, ov);
      const note = Music.NOTES[nv];
      labelEl.innerHTML = Music.ordinal(pos) + " " + note + "<sub>" + Music.midiOctave(midi) + "</sub>";
      noteSel.title = this.app.midiName(midi) + " " + Music.midiOctave(midi);
    } else {
      labelEl.innerHTML = Music.ordinal(pos);
    }
  }

  // Garantit l'unicité du nom d'un accordage personnalisé (par instrument,
  // insensible à la casse) : en cas de doublon, ajoute un suffixe _1, _2…
  // excludeId : accordage à ignorer (celui qu'on est en train d'éditer).
  uniqueName(name, instrument, excludeId) {
    const taken = new Set(
      this.app.state.customTunings
        .filter(t => t.instrument === instrument && t.id !== excludeId)
        .map(t => t.name.trim().toLowerCase())
    );
    if (!taken.has(name.trim().toLowerCase())) return name;
    const base = name.replace(/_\d+$/, "");
    for (let i = 1; ; i++) {
      const candidate = `${base}_${i}`;
      if (!taken.has(candidate.toLowerCase())) return candidate;
    }
  }

  save() {
    const { app } = this;
    const el = app.ui.el;
    const state = app.state;
    const rows = this.getRows();
    if (rows.some(r => r.noteIdx === null || r.oct === null)) {
      app.ui.showToast("Please select note and octave for all strings");
      return;
    }
    const notes = rows.map(r => Music.noteOctaveToMIDI(r.noteIdx, r.oct));
    const instrument = state.instrument;
    const existing = this.editingId
      ? state.customTunings.find(t => t.id === this.editingId) : null;
    const name = this.uniqueName(
      el.customNameInput.value.trim() || "Custom " + app.groupLabel(notes.length),
      instrument, existing ? existing.id : null);
    // Le code de partage encode instrument + notes + nom : toujours regénéré
    const shareCode = ShareCode.generate(instrument, notes, name);
    const id = existing ? existing.id : CustomTunings.newId();
    if (existing) {
      // Édition : mise à jour en place (conserve l'id et la position)
      existing.name = name;
      existing.notes = notes;
      existing.shareCode = shareCode;
    } else {
      state.customTunings.push({ id, name, instrument, notes, shareCode });
      this.editingId = id; // re-sauver = modifier, pas dupliquer
    }
    app.saveCustomTunings();
    app.selectCustomTuning({ id, name, notes });
    app.onTuningChanged();
    app.saveSettings();
    // Affichage lisible dans l'appli ; le code exact est gardé en dataset
    // pour que « Copier » produise le lien web complet
    el.customShareCodeInput.value = ShareCode.readable(shareCode);
    el.customShareCodeInput.dataset.code = shareCode;
    el.customShareDisplay.hidden = false;
    app.ui.showToast(app.t("customSaved"));
  }

  import() {
    const { app } = this;
    const el = app.ui.el;
    const code = ShareCode.extract(el.customImportInput.value);
    if (!code) return;
    const parsed = ShareCode.parse(code);
    if (!parsed) {
      app.ui.showToast("Invalid share code");
      return;
    }
    const tuning = this.addImported(parsed);
    if (parsed.instrument === app.state.instrument) {
      app.selectCustomTuning(tuning);
      app.onTuningChanged();
      app.ui.closeSheet(el.presetSheet);
    } else {
      app.ui.showToast("Imported for " + parsed.instrument + " — switch instrument to see it");
    }
    el.customImportInput.value = "";
  }

  // Crée, enregistre et renvoie un accordage depuis un code analysé
  // (nom rendu unique, code regénéré car le nom a pu être suffixé)
  addImported(parsed) {
    const { app } = this;
    const name = this.uniqueName(
      parsed.name || "Imported " + app.groupLabel(parsed.notes.length), parsed.instrument);
    const tuning = {
      id: CustomTunings.newId(),
      name,
      instrument: parsed.instrument,
      notes: parsed.notes,
      shareCode: ShareCode.generate(parsed.instrument, parsed.notes, name),
    };
    app.state.customTunings.push(tuning);
    app.saveCustomTunings();
    return tuning;
  }

  // Deep linking : https://accordo.tools/#{code} — importe (ou réutilise)
  // l'accordage du fragment d'URL, le sélectionne et nettoie l'URL.
  importFromHash() {
    const { app } = this;
    const state = app.state;
    const raw = location.hash.slice(1);
    if (!raw) return false;
    const code = ShareCode.extract(raw);
    const parsed = ShareCode.parse(code);
    if (!parsed) return false;
    // URL nettoyée immédiatement : pas de ré-import au refresh/partage d'onglet
    try { history.replaceState(null, "", location.pathname + location.search); } catch (_) {}
    state.instrument = parsed.instrument;
    // Mêmes notes déjà enregistrées pour cet instrument ? On réutilise
    // (cliquer deux fois le même lien ne crée pas de doublon).
    let tun = state.customTunings.find(x =>
      x.instrument === parsed.instrument &&
      x.notes.length === parsed.notes.length &&
      x.notes.every((n, i) => n === parsed.notes[i]));
    if (!tun) tun = this.addImported(parsed);
    app.selectCustomTuning(tun);
    app.saveSettings();
    return true;
  }
}
