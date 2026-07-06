/* ============================================================
   Accordo — Application (orchestration)
   État central, réglages (validation + persistance), boucle de
   détection, liaison des événements, démarrage.
   Dépend de : I18n, Music, ShareCode, SettingsStore, AudioEngine,
   UI, CustomTunings. Chargé en dernier.
   ============================================================ */
"use strict";

class App {
  constructor() {
    this.state = {
      instrument: "guitar",       // 'guitar' | 'bass'
      presetIndex: 0,
      lang: "en",                 // langue de l'interface
      flat: false,                // -1 demi-ton sur tout l'accordage
      calib: 440,                 // fréquence de référence A4
      soundOn: false,             // mode "Son" : toucher une corde joue la note
      auto: true,                 // détection auto de la corde
      selectedString: 0,
      tuned: [],                  // cordes validées (booléens)
      celebrated: false,
      // détection
      detectedFreq: -1,
      lastValidTime: 0,
      cents: 0,
      displayCents: 0,            // valeur lissée pour l'aiguille
      inTune: false,
      holdStart: 0,
      customTunings: [],
      customPreset: null,
    };

    this.i18n = new I18n(this);
    this.audio = new AudioEngine();
    this.ui = new UI(this);
    this.customs = new CustomTunings(this);

    this.lastDetect = 0;
    // Boucle principale liée une fois pour requestAnimationFrame
    this.tick = this.tick.bind(this);
  }

  /* ---------------- i18n (délégation) ---------------- */

  t(key) { return this.i18n.t(key); }
  groupLabel(n) { return this.i18n.groupLabel(n); }
  presetName(p) { return this.i18n.presetName(p); }

  /* ---------------- Musique (dépendant de l'état) ---------------- */

  currentPreset() {
    return this.state.customPreset || Music.PRESETS[this.state.instrument][this.state.presetIndex];
  }
  // Sélectionne un accordage personnalisé ({ id, name, notes }) comme preset courant
  selectCustomTuning(t) {
    this.state.customPreset = { _id: t.id, name: t.name, group: t.notes.length, notes: t.notes };
    this.state.presetIndex = -1;
  }
  stringMidis() {
    const off = this.state.flat ? -1 : 0;
    return this.currentPreset().notes.map(n => n + off);
  }
  midiToFreq(m) { return this.state.calib * Math.pow(2, (m - 69) / 12); }
  midiName(m) { return (this.state.flat ? Music.NOTES_FLAT : Music.NOTES)[((m % 12) + 12) % 12]; }
  midiDisplay(m) { return `${this.midiName(m)}<sub>${Music.midiOctave(m)}</sub>`; }
  midiLabel(m) { return `${this.midiName(m)} ${Music.midiOctave(m)}`; }

  /* ---------------- Réglages (validation + persistance) ---------------- */

  loadSettings() {
    const state = this.state;
    state.lang = I18n.detect();
    const s = SettingsStore.readSettings();
    if (!s) return;
    if (s.calib >= Music.CALIB_MIN && s.calib <= Music.CALIB_MAX) state.calib = s.calib;
    if (s.instrument === "guitar" || s.instrument === "bass") state.instrument = s.instrument;
    if (Number.isInteger(s.presetIndex) && Music.PRESETS[state.instrument][s.presetIndex]) state.presetIndex = s.presetIndex;
    if (typeof s.flat === "boolean") state.flat = s.flat;
    if (LANGS[s.lang]) state.lang = s.lang;
    if (typeof s.customPresetId === "string") {
      const found = state.customTunings.find(t => t.id === s.customPresetId && t.instrument === state.instrument);
      if (found) this.selectCustomTuning(found);
    }
  }

  saveSettings() {
    const state = this.state;
    SettingsStore.writeSettings({
      calib: state.calib, instrument: state.instrument,
      presetIndex: state.presetIndex, flat: state.flat, lang: state.lang,
      customPresetId: state.customPreset ? state.customPreset._id : null,
    });
  }

  loadCustomTunings() {
    this.state.customTunings = SettingsStore.readCustomTunings();
  }

  saveCustomTunings() {
    SettingsStore.writeCustomTunings(this.state.customTunings);
  }

  /* ---------------- Cycle de vie de l'accordage ---------------- */

  // Réinitialise la progression quand l'accordage cible change
  onTuningChanged() {
    const state = this.state;
    state.tuned = this.stringMidis().map(() => false);
    state.celebrated = false;
    state.holdStart = 0;
    state.selectedString = 0;
    state.auto = true;
    this.ui.renderStrings();
    this.ui.renderPresetLabel();
    this.ui.renderControls();
  }

  /* ---------------- Boucle principale ---------------- */

  tick(ts) {
    requestAnimationFrame(this.tick);

    const audio = this.audio;
    if (audio.micOk && audio.analyser && ts - this.lastDetect >= 40) {
      this.lastDetect = ts;
      audio.pushFreq(audio.detect());
      this.processDetection();
    }
    this.ui.renderGauge();
  }

  processDetection() {
    const state = this.state;
    const now = performance.now();
    const f = this.audio.stableFreq();
    if (f <= 0) {
      if (now - state.lastValidTime > 500) {
        state.detectedFreq = -1;
        state.inTune = false;
        state.holdStart = 0;
      }
      return;
    }
    state.detectedFreq = f;
    state.lastValidTime = now;

    const midis = this.stringMidis();
    let target = state.selectedString;

    if (state.auto) {
      // Corde la plus proche de la fréquence détectée
      let best = 0, bestAbs = Infinity;
      midis.forEach((m, i) => {
        const c = Math.abs(Music.centsOff(f, this.midiToFreq(m)));
        if (c < bestAbs) { bestAbs = c; best = i; }
      });
      if (best !== target) {
        target = best;
        state.selectedString = best;
        state.holdStart = 0;
        this.ui.renderStrings();
      }
    }

    state.cents = Math.max(-50, Math.min(50, Music.centsOff(f, this.midiToFreq(midis[target]))));
    state.inTune = Math.abs(state.cents) <= Music.IN_TUNE_CENTS;

    // Validation de la corde (maintien dans la zone juste)
    if (state.inTune) {
      if (!state.holdStart) state.holdStart = now;
      if (now - state.holdStart >= Music.HOLD_MS && !state.tuned[target]) {
        state.tuned[target] = true;
        this.audio.playDing();
        AudioEngine.vibrate(70);
        this.ui.el.srAnnounce.textContent = `${this.midiLabel(midis[target])} — ${this.t("inTune")}`;
        this.ui.renderStrings();
        this.checkAllTuned();
      }
    } else {
      state.holdStart = 0;
    }
  }

  checkAllTuned() {
    const state = this.state;
    if (state.celebrated || !state.tuned.every(Boolean)) return;
    state.celebrated = true;
    this.ui.showToast(this.t("done"));
    AudioEngine.vibrate([60, 60, 60]);

    setTimeout(() => {
      state.tuned = state.tuned.map(() => false);
      state.celebrated = false;
      this.ui.renderStrings();
    }, 2200);
  }

  /* ---------------- Événements ---------------- */

  bindEvents() {
    const { state, ui, audio, customs } = this;
    const el = ui.el;

    el.startBtn.addEventListener("click", async () => {
      el.startBtn.disabled = true;
      el.startBtn.textContent = this.t("init");
      const ok = await audio.init();
      if (!ok) el.micBanner.hidden = false;
      el.startOverlay.hidden = true;
      el.app.hidden = false;
      requestAnimationFrame(this.tick);
    });

    // Relance la demande d'autorisation micro (utile en PWA : pas de barre
    // d'adresse pour changer la permission). Le clic fournit le geste
    // utilisateur requis pour re-demander quand c'est encore possible.
    el.micRetry.addEventListener("click", async () => {
      el.micRetry.disabled = true;
      const ok = await audio.init();
      el.micRetry.disabled = false;
      if (ok) el.micBanner.hidden = true;
    });

    // Fermeture des feuilles : bouton dédié + clic sur le fond
    [[el.langSheet, el.langClose], [el.presetSheet, el.sheetClose], [el.customSheet, el.customSheetClose]]
      .forEach(([sheet, close]) => {
        close.addEventListener("click", () => ui.closeSheet(sheet));
        sheet.addEventListener("click", e => { if (e.target === sheet) ui.closeSheet(sheet); });
      });

    el.langBtn.addEventListener("click", () => {
      ui.renderLangSheet();
      ui.openSheet(el.langSheet, el.langBtn, el.langList.querySelector(".selected"));
    });

    el.segGuitar.addEventListener("click", () => {
      if (state.instrument === "guitar") return;
      state.instrument = "guitar";
      state.customPreset = null;
      state.presetIndex = 0;
      this.onTuningChanged();
      this.saveSettings();
    });
    el.segBass.addEventListener("click", () => {
      if (state.instrument === "bass") return;
      state.instrument = "bass";
      state.customPreset = null;
      state.presetIndex = 0;
      this.onTuningChanged();
      this.saveSettings();
    });

    el.presetBtn.addEventListener("click", () => {
      el.presetSearch.value = "";
      ui.renderPresetSheet();
      ui.openSheet(el.presetSheet, el.presetBtn, el.presetSearch);
    });
    el.presetSearch.addEventListener("input", () => ui.renderPresetSheet(el.presetSearch.value));

    // Accordages personnalisés : création + import
    el.createCustomBtn.addEventListener("click", () => {
      ui.closeSheet(el.presetSheet);
      customs.renderSheet();
      ui.openSheet(el.customSheet, el.createCustomBtn, el.customNameInput);
    });
    el.customImportBtn.addEventListener("click", () => customs.import());
    el.customImportInput.addEventListener("keydown", e => {
      if (e.key === "Enter") customs.import();
    });
    // Un lien ou code encodé collé est affiché sous forme lisible (le lien
    // n'existe que sur le web, dans l'appli on ne montre que le code)
    el.customImportInput.addEventListener("input", () => {
      const v = el.customImportInput.value;
      const code = ShareCode.extract(v);
      if (!ShareCode.parse(code)) return;
      const readable = ShareCode.readable(code);
      if (readable !== v) el.customImportInput.value = readable;
    });

    // Feuille custom
    el.customSaveBtn.addEventListener("click", () => customs.save());
    el.customAddLow.addEventListener("click", () => {
      const rows = customs.getRows();
      rows.unshift({ noteIdx: null, oct: null, added: true });
      customs.renderStringRows(rows);
    });
    el.customAddHigh.addEventListener("click", () => {
      const rows = customs.getRows();
      rows.push({ noteIdx: null, oct: null, added: true });
      customs.renderStringRows(rows);
    });
    el.customShareCopy.addEventListener("click", () => {
      el.customShareCodeInput.select();
      const code = el.customShareCodeInput.dataset.code || el.customShareCodeInput.value;
      UI.copyToClipboard(ShareCode.url(code)).catch(() => {});
      ui.showToast(this.t("customCopied"));
    });

    // Clavier : Échap ferme la feuille ouverte, Tab y reste confiné
    document.addEventListener("keydown", e => {
      const open = !el.presetSheet.hidden ? el.presetSheet
        : !el.langSheet.hidden ? el.langSheet
        : !el.customSheet.hidden ? el.customSheet
        : null;
      if (!open) return;
      if (e.key === "Escape") { e.preventDefault(); ui.closeSheet(open); }
      else if (e.key === "Tab") ui.trapFocus(open, e);
    });

    el.flatBtn.addEventListener("click", () => {
      state.flat = !state.flat;
      this.onTuningChanged();
      this.saveSettings();
    });

    el.autoBtn.addEventListener("click", () => {
      state.auto = !state.auto;
      state.holdStart = 0;
      ui.renderControls();
    });

    el.soundBtn.addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      ui.renderControls();
      if (state.soundOn) {
        audio.playNote(this.midiToFreq(this.stringMidis()[state.selectedString]));
        ui.showToast(this.t("soundToast"));
      }
    });

    el.calibDown.addEventListener("click", () => {
      if (state.calib > Music.CALIB_MIN) { state.calib--; ui.renderControls(); this.saveSettings(); }
    });
    el.calibUp.addEventListener("click", () => {
      if (state.calib < Music.CALIB_MAX) { state.calib++; ui.renderControls(); this.saveSettings(); }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) audio.suspend();
      else audio.resume();
    });

    // Lien de partage cliqué alors que l'app est déjà ouverte
    window.addEventListener("hashchange", () => {
      if (customs.importFromHash()) {
        this.onTuningChanged();
        ui.showToast(this.t("customSaved"));
      }
    });
  }

  /* ---------------- Service worker (PWA) ---------------- */

  registerServiceWorker() {
    // Mise en cache hors-ligne (uniquement si servi via http/https)
    if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;
    const el = this.ui.el;
    window.addEventListener("load", async () => {
      try {
        const reg = await navigator.serviceWorker.register("sw.js");

        // PWA installée : revérifie s'il existe une nouvelle version à chaque
        // retour au premier plan (sinon le SW n'est contrôlé qu'au lancement)
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update().catch(() => {});
        });

        // Nouveau SW activé (skipWaiting + claim) : propose de recharger.
        // hadController évite le faux positif de la toute première installation.
        let hadController = !!navigator.serviceWorker.controller;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (hadController) {
            el.updateBtn.textContent = this.t("updateReady");
            el.updateBtn.hidden = false;
          }
          hadController = true;
        });
        el.updateBtn.addEventListener("click", () => location.reload());
      } catch (_) {}
    });
  }

  /* ---------------- Démarrage ---------------- */

  init() {
    this.loadCustomTunings();
    this.loadSettings();
    const openedFromLink = this.customs.importFromHash();
    this.ui.buildGauge();
    this.bindEvents();
    this.ui.applyLang();
    this.ui.renderStrings();
    this.ui.renderPresetLabel();
    this.ui.renderControls();
    if (openedFromLink) this.ui.showToast(this.t("customSaved"));
    this.registerServiceWorker();
  }
}

/* ---------------- Bootstrap ---------------- */

const app = new App();
app.init();
