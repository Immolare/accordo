# How It Works

Accordo is a single-page PWA written in **pure vanilla JavaScript** — no framework, no dependencies, no build step. All audio processing happens locally in your browser.

## Audio capture

- `getUserMedia` requests the microphone with `echoCancellation`, `noiseSuppression` and `autoGainControl` **disabled** — these "helpers" distort musical pitch.
- The signal goes through a band-pass chain (high-pass 22 Hz → low-pass 1600 Hz) to reject rumble and hiss, then into an `AnalyserNode` (`fftSize` 8192).

## Pitch detection — YIN

Accordo uses the **YIN algorithm** (de Cheveigné & Kawahara, 2002) on a 2048-sample window:

1. **Noise gate** — frames below an RMS threshold are ignored.
2. **Difference function** — autocorrelation-style comparison of the signal with delayed copies of itself.
3. **Cumulative mean normalized difference** — normalizes the result so a single threshold (0.15) works across the whole range.
4. **Parabolic interpolation** — refines the period estimate to sub-sample precision.

The detection range covers **22 Hz to 1300 Hz** — from B0 (8-string flat tunings) to the highest frets — with measured error well **under 1 cent**.

## Stability filtering

Raw detections are noisy, so Accordo:

- keeps a 300 ms history of valid detections and uses the **median**,
- smooths the needle with an exponential lerp (disabled when the OS asks for *reduced motion*),
- requires the note to stay in the ±5-cent green zone for **1 second** before validating a string.

## Reference tones

Sound mode uses **additive synthesis**: 6 harmonics with exponential decay approximate a plucked string, so you can tune by ear without a microphone.

## Offline & privacy

- A **service worker** caches the whole app — it works with no network at all.
- Settings (tuning, language, calibration) live in `localStorage` only.
- **Nothing is recorded or transmitted**: no cookies, no analytics, no tracking, strict Content Security Policy with self-hosted assets only.

## Source

The entire app is ~1500 lines of readable JavaScript: [app.js](https://github.com/Immolare/accordo/blob/main/app.js).
