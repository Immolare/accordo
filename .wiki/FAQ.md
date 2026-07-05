# FAQ

## The needle doesn't move

- Make sure the browser has **microphone permission**: look for the mic icon in the address bar and set it to *Allow*, then reload.
- Accordo needs a **secure context**: it must be served over HTTPS (accordo.tools is) or `localhost`.
- Check that the right input device is selected in your OS sound settings.
- If your mic is unavailable, use **🔊 Sound mode** and tune by ear.

## The reading jumps around

- Tune in a quiet environment, one string at a time.
- Let the note ring instead of re-plucking rapidly.
- Old or dead strings produce inharmonic partials that confuse any tuner — fresh strings read better.

## Does it work offline?

Yes. After the first visit, a service worker caches the whole app. Install it on your home screen (PWA) and it works with no connection at all.

## Is my audio recorded or sent anywhere?

**No.** The microphone signal is analyzed in real time inside your browser and is never recorded, stored or transmitted. Accordo has no server-side code, no cookies, no analytics, no ads.

## Can I use a different reference pitch than 440 Hz?

Yes — use the **− / +** buttons in the top bar. The reference A4 can be set anywhere from **415 Hz** (baroque) to **465 Hz**, in 1 Hz steps.

## How accurate is it?

The YIN-based detector is accurate to well under **1 cent** across the whole supported range (about 23 Hz to 1300 Hz). The green "in tune" zone is ±5 cents, which is tighter than most clip-on tuners.

## Which languages are supported?

English, Français, Español, Italiano, Deutsch, Português, 中文, 日本語 and 한국어. The language is auto-detected and can be changed with the button in the top bar.

## I found a bug

Please [report it](https://github.com/Immolare/accordo/issues) with your browser, device, and what you expected to happen.
