# Accordo

**A free, ad-free, precision guitar & bass tuner that runs entirely in your browser.**

Accordo is a lightweight Progressive Web App (PWA) built for beginners and pros alike: tune any 6/7/8-string guitar or 4/5/6-string bass with chromatic precision, pick from 50+ tunings, or tune by ear with built-in reference tones.

🎸 **Try it live:** [accordo.tools](https://accordo.tools) — no install, no account, no ads.

## Features

- 🎯 **Accurate pitch detection** — YIN algorithm with parabolic interpolation, accurate to well under 1 cent, from B0 (~23 Hz, 8-string flat tunings) up to the highest frets
- 🎸 **Guitar & bass** — 6/7/8-string guitars, 4/5/6-string basses
- 🎼 **50+ tunings** — every widely used tuning: Standards (E to F#), Drops (D to D on 8-string), Opens (G, A, C, D, D minor, E), DADGAD, All Fourths, high-C bass and more
- 🔍 **Smart search** — relevance-ranked search that understands note names (`standard e` won't match Standard Eb)
- ♭ **Flat switch** — instantly shift any tuning down a half step
- 🔊 **Sound mode** — play realistic reference tones and tune by ear (works even without microphone access)
- 🤖 **Auto string detection** — the tuner recognizes which string you're playing
- ✅ **Guided tuning** — strings are validated one by one, with haptic feedback and a completion toast
- 🎚 **Calibration** — adjustable reference pitch (415–465 Hz, default A4 = 440 Hz)
- 🌍 **9 languages** — English, Français, Español, Italiano, Deutsch, Português, 中文, 日本語, 한국어 (auto-detected)
- 📱 **PWA** — installable on your home screen, works fully offline
- 🚫 **No ads, no cookies, no tracking** — audio is processed 100% locally; nothing ever leaves your device

## Tech

- Pure vanilla JavaScript, HTML and CSS — **zero dependencies, no build step**
- Web Audio API (`getUserMedia` + `AnalyserNode`) for capture, YIN autocorrelation for pitch detection
- Additive synthesis (6 harmonics with exponential decay) for plucked-string reference tones
- Service worker for offline support
- Preferences stored in `localStorage` only

## Run locally

No toolchain required — it's static files:

```bash
git clone https://github.com/Immolare/accordo.git
cd accordo
# serve with any static server, e.g.:
python -m http.server 8000
# then open http://localhost:8000
```

> Microphone access requires a secure context: `localhost` or HTTPS (GitHub Pages works out of the box).

## Deploy on GitHub Pages

1. Push this repository to GitHub
2. **Settings → Pages → Source**: deploy from branch `main`, folder `/ (root)`
3. **Settings → Pages → Custom domain**: enter `accordo.tools` (the `CNAME` file in this repo keeps it set), point your DNS to GitHub Pages (`A` records or `CNAME`), and tick **Enforce HTTPS**
4. The tuner is live at [https://accordo.tools](https://accordo.tools)

## Security

- Strict Content Security Policy (self-hosted assets only, no third-party scripts)
- No external dependencies — nothing to supply-chain-attack
- Served over HTTPS with no referrer leakage (`no-referrer` policy)
- No cookies, no storage of personal data

## Privacy

Accordo collects **no data whatsoever**:

- No cookies, no analytics, no trackers
- Microphone audio is analyzed in real time inside your browser and never recorded or transmitted
- Settings (tuning, language, calibration) are kept in your browser's local storage only

See the in-app [legal notice](legal.html) for full details (French & English).

## Author

**Pierre Viéville** — [pierrevieville.fr](https://pierrevieville.fr)

- 📧 [contact@pierrevieville.fr](mailto:contact@pierrevieville.fr)
- 📸 Instagram: [pierre.vieville.metal](https://www.instagram.com/pierre.vieville.metal)
- 🎵 TikTok: [pierrevieville](https://www.tiktok.com/@pierrevieville)

## License

Released under the [MIT License](LICENSE) — © 2026 Pierre Viéville.
