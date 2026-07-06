/* ============================================================
   Accordo — Moteur audio
   Micro (Web Audio API), détection de hauteur YIN, sons de
   référence et bips. Aucune dépendance au DOM : init() renvoie
   un booléen de succès, l'app gère l'affichage.
   ============================================================ */
"use strict";

class AudioEngine {
  static YIN_THRESHOLD = 0.15;
  static YIN_WINDOW = 2048;

  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.micOk = false;
    this.timeBuf = null;
    this.byteBuf = null;        // repli si getFloatTimeDomainData absent
    this.yinD = null;
    this.yinCMND = null;
    this.noiseFloor = 0.003;    // plancher de bruit suivi en continu
    this.freqHistory = [];      // détections récentes pour lissage médian
  }

  // Initialise le contexte audio et le micro. -> true si le micro est prêt.
  async init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!this.ctx) this.ctx = new AC();
    if (this.ctx.state === "suspended") { try { await this.ctx.resume(); } catch (_) {} }

    try {
      // Contraintes en "ideal" : mieux honorées par les navigateurs mobiles
      // (iOS Safari / Chrome Android) qui, sinon, laissent actifs l'AGC, la
      // suppression de bruit et l'annulation d'écho — tous nuisibles à la
      // détection de hauteur d'un instrument.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: { ideal: false },
          noiseSuppression: { ideal: false },
          autoGainControl: { ideal: false },
          channelCount: { ideal: 1 },
          latency: { ideal: 0 },
        },
        video: false,
      });
      // Seconde tentative directement sur la piste : certains Android
      // n'appliquent ces réglages que via applyConstraints après coup.
      const track = stream.getAudioTracks()[0];
      if (track && track.applyConstraints) {
        try {
          await track.applyConstraints({
            echoCancellation: false, noiseSuppression: false, autoGainControl: false,
          });
        } catch (_) {}
      }
      const src = this.ctx.createMediaStreamSource(stream);
      const hp = this.ctx.createBiquadFilter();
      hp.type = "highpass"; hp.frequency.value = 22; hp.Q.value = 0.7;
      const lp = this.ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 1600; lp.Q.value = 0.7;
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 8192;
      this.analyser.smoothingTimeConstant = 0;
      src.connect(hp); hp.connect(lp); lp.connect(this.analyser);
      this.timeBuf = new Float32Array(this.analyser.fftSize);
      this.micOk = true;
    } catch (_) {
      this.micOk = false;
    }
    return this.micOk;
  }

  // Onglet masqué / réaffiché : suspend et reprend le contexte
  suspend() { if (this.ctx) this.ctx.suspend(); }
  resume() { if (this.ctx) this.ctx.resume(); }

  // Lit les échantillons du micro et renvoie la fréquence instantanée (-1 si rien)
  detect() {
    this.readSamples();
    return this.yinDetect(this.timeBuf, this.ctx.sampleRate);
  }

  // Récupère les échantillons (avec repli si getFloatTimeDomainData absent)
  readSamples() {
    if (this.analyser.getFloatTimeDomainData) {
      this.analyser.getFloatTimeDomainData(this.timeBuf);
    } else {
      if (!this.byteBuf) this.byteBuf = new Uint8Array(this.analyser.fftSize);
      this.analyser.getByteTimeDomainData(this.byteBuf);
      for (let i = 0; i < this.byteBuf.length; i++) this.timeBuf[i] = (this.byteBuf[i] - 128) / 128;
    }
  }

  /* ---------------- Détection de hauteur (YIN) ---------------- */

  yinDetect(buf, sr) {
    const W = AudioEngine.YIN_WINDOW;
    const tauMax = Math.min(Math.floor(sr / 22), buf.length - W - 1);
    const tauMin = Math.max(2, Math.floor(sr / 1200));
    if (tauMax <= tauMin) return -1;

    // Porte de bruit adaptative : les micros de téléphone ont des gains très
    // variables (AGC, matériel). Le plancher descend immédiatement au niveau
    // ambiant et remonte lentement, la porte suit à 2,5× au-dessus.
    let rms = 0;
    for (let i = 0; i < W; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / W);
    this.noiseFloor = Math.min(this.noiseFloor * 1.008, Math.max(rms, 1e-4));
    if (rms < Math.max(0.0015, this.noiseFloor * 2.5)) return -1;

    if (!this.yinD || this.yinD.length < tauMax + 1) {
      this.yinD = new Float32Array(tauMax + 1);
      this.yinCMND = new Float32Array(tauMax + 1);
    }
    const yinD = this.yinD, yinCMND = this.yinCMND;

    // Fonction de différence
    for (let tau = 1; tau <= tauMax; tau++) {
      let sum = 0;
      for (let i = 0; i < W; i++) {
        const d = buf[i] - buf[i + tau];
        sum += d * d;
      }
      yinD[tau] = sum;
    }

    // Différence normalisée cumulée
    yinCMND[0] = 1;
    let running = 0;
    for (let tau = 1; tau <= tauMax; tau++) {
      running += yinD[tau];
      yinCMND[tau] = running > 0 ? (yinD[tau] * tau) / running : 1;
    }

    // Premier minimum sous le seuil
    let tau = -1;
    for (let t = tauMin; t <= tauMax; t++) {
      if (yinCMND[t] < AudioEngine.YIN_THRESHOLD) {
        while (t + 1 <= tauMax && yinCMND[t + 1] < yinCMND[t]) t++;
        tau = t;
        break;
      }
    }
    // Repli signaux faibles (guitare électrique non branchée, micro lointain…) :
    // à défaut de minimum sous le seuil, on prend le minimum global si sa
    // qualité reste acceptable. Le lissage médian aval filtre les ratés.
    if (tau === -1) {
      let best = -1, bestVal = 0.35;
      for (let t = tauMin; t <= tauMax; t++) {
        if (yinCMND[t] < bestVal) { bestVal = yinCMND[t]; best = t; }
      }
      tau = best;
    }
    if (tau === -1) return -1;

    // Interpolation parabolique (précision sub-échantillon)
    let betterTau = tau;
    if (tau > 1 && tau < tauMax) {
      const s0 = yinCMND[tau - 1], s1 = yinCMND[tau], s2 = yinCMND[tau + 1];
      const denom = s0 - 2 * s1 + s2;
      if (Math.abs(denom) > 1e-9) betterTau = tau + 0.5 * (s0 - s2) / denom;
    }

    const freq = sr / betterTau;
    return (freq >= 22 && freq <= 1300) ? freq : -1;
  }

  /* ---------------- Lissage : médiane des dernières détections ---------------- */

  pushFreq(f) {
    const now = performance.now();
    if (f > 0) this.freqHistory.push({ f, t: now });
    while (this.freqHistory.length && now - this.freqHistory[0].t > 300) this.freqHistory.shift();
  }

  stableFreq() {
    const vals = this.freqHistory.map(h => h.f);
    if (vals.length < 2) return -1;
    vals.sort((a, b) => a - b);
    return vals[Math.floor(vals.length / 2)];
  }

  /* ---------------- Sons de référence & bips ---------------- */

  playNote(freq, duration = 2.2) {
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === "suspended") try { ctx.resume(); } catch (_) {}
    const t0 = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, t0);
    master.gain.exponentialRampToValueAtTime(0.5, t0 + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(Math.min(freq * 9, 8000), t0);
    lp.frequency.exponentialRampToValueAtTime(Math.max(freq * 2, 300), t0 + duration);

    master.connect(lp);
    lp.connect(ctx.destination);

    // Timbre "corde pincée" : harmoniques à décroissance exponentielle
    const harmonics = [1, 0.55, 0.32, 0.18, 0.09, 0.05];
    harmonics.forEach((amp, k) => {
      const f = freq * (k + 1);
      if (f > ctx.sampleRate / 2) return;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t0);
      const g = ctx.createGain();
      g.gain.setValueAtTime(amp, t0);
      g.gain.exponentialRampToValueAtTime(amp * 0.01, t0 + duration * (1 - k * 0.11));
      osc.connect(g);
      g.connect(master);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    });
  }

  playDing() {
    const ctx = this.ctx;
    if (!ctx) return;
    const t0 = ctx.currentTime;
    [1318.5, 1975.5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(i === 0 ? 0.18 : 0.08, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t0); osc.stop(t0 + 0.55);
    });
  }

  static vibrate(ms) { if (navigator.vibrate) navigator.vibrate(ms); }
}
