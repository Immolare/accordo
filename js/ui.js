/* ============================================================
   Accordo — Interface utilisateur
   Références DOM, rendu (cordes, cadran, feuilles, contrôles),
   feuilles modales accessibles, toast, presse-papiers.
   Dépend de : Music, ShareCode, i18n (LANGS), App (injectée).
   ============================================================ */
"use strict";

class UI {
  // Icônes SVG inline des boutons (couleur héritée via currentColor,
  // centrage géométrique fiable contrairement aux glyphes × / emojis)
  static ICONS = {
    cross: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  };

  // Respecte la préférence "réduire les animations" (aiguille sans lissage)
  static REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // applyLang : correspondances élément → clé i18n
  static LANG_TEXTS = {
    tagline: "tagline", startHint: "startHint", segGuitar: "guitar", segBass: "bass",
    sheetTitle: "tunings", langTitle: "language", flatLabel: "flat", autoLabel: "auto",
    soundLabel: "sound", micBannerText: "micBanner", micRetry: "micRetry", legalLink: "legal",
    customSheetTitle: "customSheet", customSaveBtn: "customSave", createCustomBtn: "customCreate",
    customImportBtn: "customImport", customAddLow: "customAddLow", customAddHigh: "customAddHigh",
    customShareLabel: "customShare", customShareCopy: "customCopy",
  };
  static LANG_PLACEHOLDERS = {
    presetSearch: "search", customNameInput: "customName", customImportInput: "customImportPH",
  };
  static LANG_ARIA_LABELS = {
    langBtn: "language", sheetClose: "close", langClose: "close", customSheetClose: "close",
    calibDown: "calibDown", calibUp: "calibUp",
  };

  // Géométrie du cadran SVG
  static GAUGE_CX = 150;
  static GAUGE_CY = 152;
  static GAUGE_R = 118;
  static MAX_ANGLE = 58; // degrés de chaque côté pour ±50 cents

  constructor(app) {
    this.app = app;
    this.toastTimer = null;
    this.sheetReturnFocus = null;

    const $ = id => document.getElementById(id);
    this.el = {
      startOverlay: $("startOverlay"), startBtn: $("startBtn"), app: $("app"),
      tagline: $("tagline"), startHint: $("startHint"),
      langBtn: $("langBtn"), langSheet: $("langSheet"), langList: $("langList"),
      langClose: $("langClose"), langTitle: $("langTitle"),
      segGuitar: $("segGuitar"), segBass: $("segBass"),
      presetBtn: $("presetBtn"), presetLabel: $("presetLabel"),
      presetSheet: $("presetSheet"), presetList: $("presetList"), sheetClose: $("sheetClose"),
      sheetTitle: $("sheetTitle"), presetSearch: $("presetSearch"),
      gauge: $("gauge"), ticks: $("ticks"), zoneArc: $("zoneArc"), needle: $("needle"),
      noteName: $("noteName"), centsLabel: $("centsLabel"), freqLabel: $("freqLabel"), statusText: $("statusText"),
      stringsRow: $("stringsRow"),
      flatBtn: $("flatBtn"), autoBtn: $("autoBtn"), soundBtn: $("soundBtn"),
      flatLabel: $("flatLabel"), autoLabel: $("autoLabel"), soundLabel: $("soundLabel"),
      calibDown: $("calibDown"), calibUp: $("calibUp"), calibValue: $("calibValue"),
      micBanner: $("micBanner"), micBannerText: $("micBannerText"), micRetry: $("micRetry"),
      legalLink: $("legalLink"),
      createCustomBtn: $("createCustomBtn"),
      customImportInput: $("customImportInput"),
      customImportBtn: $("customImportBtn"),
      customSheet: $("customSheet"),
      customSheetTitle: $("customSheetTitle"),
      customSheetClose: $("customSheetClose"),
      customNameInput: $("customNameInput"),
      customStringsContainer: $("customStringsContainer"),
      customAddLow: $("customAddLow"),
      customAddHigh: $("customAddHigh"),
      customSaveBtn: $("customSaveBtn"),
      customShareDisplay: $("customShareDisplay"),
      customShareLabel: $("customShareLabel"),
      customShareCodeInput: $("customShareCodeInput"),
      customShareCopy: $("customShareCopy"),
      toast: $("toast"),
      updateBtn: $("updateBtn"),
      srAnnounce: $("srAnnounce"),
    };

    this.initViewportVar();
  }

  // Clavier virtuel mobile : expose sa hauteur en variable CSS --kb pour que
  // les feuilles (recherche d'accordage…) restent visibles au-dessus du clavier
  initViewportVar() {
    if (!window.visualViewport) return;
    const vv = window.visualViewport;
    const updateKb = () => {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty("--kb", `${Math.round(kb)}px`);
    };
    vv.addEventListener("resize", updateKb);
    vv.addEventListener("scroll", updateKb);
  }

  /* ---------------- Cadran (SVG) ---------------- */

  polar(angleDeg, r) {
    const a = (angleDeg - 90) * Math.PI / 180;
    return [UI.GAUGE_CX + r * Math.cos(a), UI.GAUGE_CY + r * Math.sin(a)];
  }

  buildGauge() {
    const frag = document.createDocumentFragment();
    for (let c = -50; c <= 50; c += 5) {
      const angle = (c / 50) * UI.MAX_ANGLE;
      const major = c % 25 === 0;
      const [x1, y1] = this.polar(angle, UI.GAUGE_R);
      const [x2, y2] = this.polar(angle, UI.GAUGE_R - (major ? 16 : 9));
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1); line.setAttribute("y1", y1);
      line.setAttribute("x2", x2); line.setAttribute("y2", y2);
      line.setAttribute("class", "tick" + (c === 0 ? " center" : major ? " major" : ""));
      frag.appendChild(line);
    }
    this.el.ticks.appendChild(frag);

    // Arc de la zone "juste" (±5 cents)
    const az = (Music.IN_TUNE_CENTS / 50) * UI.MAX_ANGLE;
    const rArc = UI.GAUGE_R - 28;
    const [sx, sy] = this.polar(-az, rArc);
    const [ex, ey] = this.polar(az, rArc);
    this.el.zoneArc.setAttribute("d", `M ${sx} ${sy} A ${rArc} ${rArc} 0 0 1 ${ex} ${ey}`);
  }

  /* ---------------- Langue ---------------- */

  // Applique la langue à tous les textes statiques (via les tables LANG_*)
  applyLang() {
    const { app, el } = this;
    const t = k => app.t(k);
    document.documentElement.lang = app.state.lang;
    document.title = t("docTitle");
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t("metaDesc"));
    el.langBtn.textContent = app.state.lang.toUpperCase();
    if (!el.startBtn.disabled) el.startBtn.textContent = t("start");
    for (const [id, key] of Object.entries(UI.LANG_TEXTS)) if (el[id]) el[id].textContent = t(key);
    for (const [id, key] of Object.entries(UI.LANG_PLACEHOLDERS)) if (el[id]) el[id].placeholder = t(key);
    for (const [id, key] of Object.entries(UI.LANG_ARIA_LABELS)) if (el[id]) el[id].setAttribute("aria-label", t(key));
    this.renderPresetLabel();
    this.renderStrings();
  }

  /* ---------------- Rendu ---------------- */

  renderStrings() {
    const { app, el } = this;
    const state = app.state;
    const midis = app.stringMidis();
    if (state.tuned.length !== midis.length) state.tuned = midis.map(() => false);
    if (state.selectedString >= midis.length) state.selectedString = 0;

    el.stringsRow.innerHTML = "";
    midis.forEach((m, i) => {
      const btn = document.createElement("button");
      btn.className = "string-btn"
        + (i === state.selectedString ? " selected" : "")
        + (state.tuned[i] ? " tuned" : "");
      btn.setAttribute("aria-label",
        `${app.t("stringN")} ${midis.length - i} — ${app.midiLabel(m)}${state.tuned[i] ? " — " + app.t("inTune") : ""}`);
      if (i === state.selectedString) btn.setAttribute("aria-current", "true");
      btn.innerHTML = `<span class="s-note" aria-hidden="true">${app.midiDisplay(m)}</span>`;
      btn.addEventListener("click", () => {
        state.selectedString = i;
        state.auto = false;
        state.holdStart = 0;
        if (state.soundOn) app.audio.playNote(app.midiToFreq(m));
        this.renderStrings();
        this.renderControls();
      });
      el.stringsRow.appendChild(btn);
    });
  }

  renderPresetLabel() {
    const { app, el } = this;
    const p = app.currentPreset();
    el.presetLabel.textContent = `${app.presetName(p)}${app.state.flat ? " ♭" : ""} · ${app.groupLabel(p.group)}`;
  }

  renderControls() {
    const { el } = this;
    const state = this.app.state;
    el.flatBtn.classList.toggle("active", state.flat);
    el.autoBtn.classList.toggle("active", state.auto);
    el.soundBtn.classList.toggle("active", state.soundOn);
    el.flatBtn.setAttribute("aria-pressed", String(state.flat));
    el.autoBtn.setAttribute("aria-pressed", String(state.auto));
    el.soundBtn.setAttribute("aria-pressed", String(state.soundOn));
    el.segGuitar.classList.toggle("active", state.instrument === "guitar");
    el.segBass.classList.toggle("active", state.instrument === "bass");
    el.segGuitar.setAttribute("aria-selected", String(state.instrument === "guitar"));
    el.segBass.setAttribute("aria-selected", String(state.instrument === "bass"));
    el.calibValue.textContent = `${state.calib} Hz`;
  }

  // Normalisation pour la recherche (minuscules, sans accents)
  static norm(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  renderPresetSheet(filter = "") {
    const { app, el } = this;
    const state = app.state;
    const norm = UI.norm;
    const q = norm(filter.trim()).replace(/♯/g, "#").replace(/♭/g, "b");
    el.presetList.innerHTML = "";
    const presets = Music.PRESETS[state.instrument];
    const customs = state.customTunings.filter(t => t.instrument === state.instrument);
    let count = 0;

    const off = state.flat ? -1 : 0;

    const isCustomSelected = (t) =>
      state.customPreset && state.customPreset._id === t.id;

    const addBuiltinItem = (p, idx, showGroup) => {
      const item = document.createElement("button");
      item.className = "sheet-item" + (idx === state.presetIndex ? " selected" : "");
      if (idx === state.presetIndex) item.setAttribute("aria-current", "true");
      item.innerHTML = `<span class="p-main"><span class="p-name">${app.presetName(p)}</span>${
        showGroup ? `<span class="p-tag">${app.groupLabel(p.group)}</span>` : ""}<br>
        <span class="p-notes">${p.notes.map(n => app.midiDisplay(n + off)).join(" · ")}</span></span>
        <span class="p-check" aria-hidden="true">✓</span>`;
      item.addEventListener("click", () => {
        state.customPreset = null;
        state.presetIndex = idx;
        app.onTuningChanged();
        this.closeSheet(el.presetSheet);
        app.saveSettings();
      });
      el.presetList.appendChild(item);
      count++;
    };

    const addCustomItem = (custom) => {
      const sel = isCustomSelected(custom);
      const item = document.createElement("button");
      item.className = "sheet-item" + (sel ? " selected" : "");
      if (sel) item.setAttribute("aria-current", "true");
      item.innerHTML = `<span class="p-main"><span class="p-name"></span>
        <span class="p-tag">${app.groupLabel(custom.notes.length)}</span><br>
        <span class="p-notes">${custom.notes.map(n => app.midiDisplay(n + off)).join(" · ")}</span></span>
        <span class="p-check" aria-hidden="true">✓</span>`;
      item.querySelector(".p-name").textContent = custom.name;
      item.addEventListener("click", () => {
        app.selectCustomTuning(custom);
        app.onTuningChanged();
        this.closeSheet(el.presetSheet);
        app.saveSettings();
      });
      const editBtn = document.createElement("button");
      editBtn.className = "custom-preset-edit";
      editBtn.innerHTML = UI.ICONS.pencil;
      editBtn.setAttribute("aria-label", "Edit");
      editBtn.addEventListener("click", e => {
        e.stopPropagation();
        this.closeSheet(el.presetSheet);
        app.customs.renderSheet(custom);
        this.openSheet(el.customSheet, el.createCustomBtn, el.customNameInput);
      });
      item.appendChild(editBtn);
      const copyBtn = document.createElement("button");
      copyBtn.className = "custom-preset-copy";
      copyBtn.innerHTML = UI.ICONS.copy;
      copyBtn.setAttribute("aria-label", app.t("customCopy"));
      copyBtn.addEventListener("click", e => {
        e.stopPropagation();
        const code = ShareCode.generate(custom.instrument, custom.notes, custom.name);
        UI.copyToClipboard(ShareCode.url(code)).catch(() => {});
        this.showToast(app.t("customCopied"));
      });
      item.appendChild(copyBtn);
      const delBtn = document.createElement("button");
      delBtn.className = "custom-preset-del";
      delBtn.innerHTML = UI.ICONS.cross;
      delBtn.setAttribute("aria-label", "Delete");
      delBtn.addEventListener("click", e => {
        e.stopPropagation();
        state.customTunings = state.customTunings.filter(x => x.id !== custom.id);
        if (state.customPreset && state.customPreset._id === custom.id) {
          state.customPreset = null;
          state.presetIndex = 0;
          app.onTuningChanged();
        }
        app.saveCustomTunings();
        this.renderPresetSheet(filter);
      });
      item.appendChild(delBtn);
      el.presetList.appendChild(item);
      count++;
    };

    if (!q) {
      // Accordages personnalisés d'abord
      if (customs.length) {
        const h = document.createElement("div");
        h.className = "sheet-group";
        h.textContent = "Custom";
        el.presetList.appendChild(h);
        customs.forEach(t => addCustomItem(t));
      }

      // Presets intégrés groupés par nombre de cordes
      let lastGroup = null;
      presets.forEach((p, idx) => {
        if (p.group !== lastGroup) {
          lastGroup = p.group;
          const h = document.createElement("div");
          h.className = "sheet-group";
          h.textContent = app.groupLabel(p.group);
          el.presetList.appendChild(h);
        }
        addBuiltinItem(p, idx);
      });
    } else {
      // Avec recherche : filtrage strict + tri par pertinence.
      // Les jetons "note" (e, eb, c#…) exigent une correspondance exacte
      // pour éviter que « standard e » ne renvoie aussi Standard Eb, etc.
      const tokens = q.split(/\s+/);
      const noteRe = /^[a-g][#b]?$/;
      const numRe = /^\d+$/;
      const allNotes = tokens.every(tok => noteRe.test(tok));
      // Bonus de correspondance exacte / préfixe / inclusion du nom complet
      const exactBonus = nameN =>
        nameN === q ? 100 : nameN.startsWith(q) ? 50 : nameN.includes(q) ? 30 : 0;

      // Score des presets intégrés
      const scored = [];
      presets.forEach((p, idx) => {
        const nameN = norm(app.presetName(p));
        const words = nameN.split(/[\s()]+/).filter(Boolean);
        const groupN = norm(app.groupLabel(p.group));
        const noteSet = new Set();
        for (const n of p.notes) {
          const pc = ((n % 12) + 12) % 12;
          noteSet.add(norm(Music.NOTES[pc]));
          noteSet.add(norm(Music.NOTES_FLAT[pc]));
        }
        let score = 0;
        let ok = true;
        for (const tok of tokens) {
          if (numRe.test(tok)) {
            if (String(p.group) === tok) score += 10;
            else { ok = false; break; }
          } else if (noteRe.test(tok)) {
            if (words.includes(tok)) score += 10;
            else if (allNotes && noteSet.has(tok)) score += 2;
            else { ok = false; break; }
          } else if (words.includes(tok)) {
            score += 10;
          } else if (words.some(w => w.startsWith(tok))) {
            score += 6;
          } else if (groupN.includes(tok)) {
            score += 3;
          } else { ok = false; break; }
        }
        if (!ok) return;
        scored.push({ p, idx, score: score + exactBonus(nameN), type: "builtin" });
      });

      // Score des accordages personnalisés
      customs.forEach(t => {
        const nameN = norm(t.name);
        let score = 0;
        let ok = true;
        for (const tok of tokens) {
          if (numRe.test(tok)) {
            if (String(t.notes.length) === tok) score += 10;
            else { ok = false; break; }
          } else if (nameN.includes(tok)) {
            score += 10;
          } else {
            ok = false; break;
          }
        }
        if (!ok) return;
        scored.push({ t, score: score + exactBonus(nameN), type: "custom" });
      });

      scored.sort((a, b) => b.score - a.score || (a.type === "custom" ? -1 : 1));
      scored.forEach(entry => {
        if (entry.type === "custom") addCustomItem(entry.t);
        else addBuiltinItem(entry.p, entry.idx, true);
      });
    }

    if (!count) {
      const empty = document.createElement("div");
      empty.className = "sheet-empty";
      empty.textContent = app.t("noResults");
      el.presetList.appendChild(empty);
    }
  }

  renderLangSheet() {
    const { app, el } = this;
    el.langList.innerHTML = "";
    Object.entries(LANGS).forEach(([code, label]) => {
      const item = document.createElement("button");
      item.className = "sheet-item" + (code === app.state.lang ? " selected" : "");
      item.setAttribute("lang", code);
      if (code === app.state.lang) item.setAttribute("aria-current", "true");
      item.innerHTML = `<span class="p-main"><span class="p-name"></span></span>
        <span class="p-check" aria-hidden="true">✓</span>`;
      item.querySelector(".p-name").textContent = label;
      item.addEventListener("click", () => {
        app.state.lang = code;
        this.applyLang();
        this.closeSheet(el.langSheet);
        app.saveSettings();
      });
      el.langList.appendChild(item);
    });
  }

  /* ---------------- Rendu du cadran ---------------- */

  renderGauge() {
    const { app, el } = this;
    const state = app.state;
    const active = state.detectedFreq > 0;
    const targetCents = active ? state.cents : 0;
    state.displayCents += (targetCents - state.displayCents) * (UI.REDUCED_MOTION ? 1 : 0.18);
    if (Math.abs(state.displayCents - targetCents) < 0.05) state.displayCents = targetCents;

    const angle = (state.displayCents / 50) * UI.MAX_ANGLE;
    el.needle.setAttribute("transform", `rotate(${angle} ${UI.GAUGE_CX} ${UI.GAUGE_CY})`);

    const midis = app.stringMidis();
    const m = midis[state.selectedString];
    const html = app.midiDisplay(m);
    if (el.noteName.innerHTML !== html) el.noteName.innerHTML = html;

    el.gauge.classList.toggle("idle", !active);
    el.gauge.classList.toggle("in-tune", active && state.inTune);
    el.noteName.classList.toggle("in-tune", active && state.inTune);
    el.centsLabel.classList.toggle("in-tune", active && state.inTune);
    el.statusText.classList.toggle("in-tune", active && state.inTune);

    const micOk = app.audio.micOk;
    if (active) {
      const c = Math.round(state.cents);
      UI.setText(el.centsLabel, `${c > 0 ? "+" : ""}${c} ${app.t("cents")}`);
      UI.setText(el.freqLabel, `${state.detectedFreq.toFixed(1)} Hz`);
      UI.setText(el.statusText, state.inTune ? app.t("inTune")
        : state.cents < 0 ? app.t("tooLow")
        : app.t("tooHigh"));
    } else {
      UI.setText(el.centsLabel, "\u00A0");
      UI.setText(el.freqLabel, micOk ? "\u00A0" : app.t("micOff"));
      UI.setText(el.statusText, micOk ? app.t("play") : app.t("soundHint"));
    }
    // « micro désactivé » : masque la colonne cents pour centrer le message
    el.freqLabel.parentElement.classList.toggle("mic-off", !micOk);
  }

  // Ne met à jour le DOM que si le texte change (évite que les lecteurs
  // d'écran ré-annoncent le même statut à chaque frame)
  static setText(node, txt) {
    if (node.textContent !== txt) node.textContent = txt;
  }

  /* ---------------- Presse-papiers ---------------- */

  static copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;left:-9999px;top:-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); }
      catch (_) { reject(_); }
      document.body.removeChild(ta);
    });
  }

  /* ---------------- Toast ---------------- */

  showToast(msg) {
    this.el.toast.textContent = msg;
    this.el.toast.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.el.toast.hidden = true; }, 2000);
  }

  /* ---------------- Feuilles modales accessibles ---------------- */
  // Focus déplacé à l'ouverture, restitué à la fermeture, fond inert, Échap géré

  openSheet(overlay, trigger, focusTarget) {
    overlay.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    this.sheetReturnFocus = trigger;
    this.el.app.inert = true;
    (focusTarget || overlay.querySelector("button, input")).focus();
  }

  closeSheet(overlay) {
    const { el } = this;
    overlay.hidden = true;
    const anyOpen = !el.presetSheet.hidden || !el.langSheet.hidden || !el.customSheet.hidden;
    if (!anyOpen) el.app.inert = false;
    el.presetBtn.setAttribute("aria-expanded", String(!el.presetSheet.hidden));
    el.langBtn.setAttribute("aria-expanded", String(!el.langSheet.hidden));
    el.createCustomBtn.setAttribute("aria-expanded", String(!el.customSheet.hidden));
    if (this.sheetReturnFocus) { this.sheetReturnFocus.focus(); this.sheetReturnFocus = null; }
  }

  // Piège à focus : Tab reste dans la feuille ouverte
  trapFocus(overlay, e) {
    const focusables = overlay.querySelectorAll("button:not([disabled]), input");
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
