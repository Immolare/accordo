# Custom Tunings

Accordo lets you create, edit and share your own tunings — stored entirely in your browser, no account needed.

## Create a tuning

1. Open the tuning selector and tap **Create a tuning** at the bottom of the list.
2. Pick a **note** and an **octave** for each string. Strings are listed from the lowest (top) to the highest (bottom), with standard numbering: **string 1 is the highest**.
3. Use **+ Add low string** / **+ Add high string** to go beyond your instrument's base string count — adding a low string to a 6-string guitar makes it the 7th, just like a real 7-string.
4. Name it (optional — a name is generated if left blank) and tap **Save**.

Your tuning appears in a **Custom** section at the top of the tuning list and behaves like any built-in tuning (Flat switch, search, auto detection…).

> Guitars keep a minimum of **6 strings** and basses **4**: only extra strings show a remove button.

Names are unique per instrument — saving a duplicate name automatically adds a suffix (`_1`, `_2`…).

## Edit or delete

In the tuning list, each custom tuning has:

- ✏️ **Pencil** — reopen the editor with the tuning pre-filled; saving updates it in place.
- 📋 **Copy** — copy its share link (see below).
- ✕ **Cross** — delete it.

## Share a tuning

Every custom tuning has a compact **share code**, shown in the editor after saving, e.g.:

```
G6E2A2D3G3B3E4:Metal
```

- `G` or `B` — guitar or bass
- `6` — number of strings
- `E2 A2 D3 G3 B3 E4` — note + octave of each string, lowest to highest
- `:Metal` — the tuning name

The **Copy** buttons copy a full link like `https://accordo.tools/#G6E2A2D3G3B3E4%3AMetal`. Anyone opening that link gets the tuning **imported and selected automatically** — opening the same link twice never creates a duplicate.

## Import a tuning

In the tuning selector, paste a **share code or link** into the import field and tap **Import**. The tuning is saved and selected (if it matches your current instrument).

## Storage & privacy

Custom tunings live in your browser's `localStorage` only — nothing is sent to any server. Clearing the site's data removes them, so keep the share codes of tunings you care about.
