# Citroën Basalt X · Test-drive demo

A click-through demo in the style of the Tide offline-sampling demo, with the people from the HUL CDP demo. It follows one lead (Shubham Kohli, Rajouri Garden) through four stages:

1. **Booking**: Instagram ad → citroen.in booking page → OTP → WhatsApp.
2. **Validation**: driving licence (OCR + Parivahan match), optional soft credit check, address quality score, intent and exchange enrichment → grade-A lead.
3. **Fulfilment**: offered to the 3 nearest dealerships; the first to accept wins (Kirti Nagar, 1 m 48 s); consultant, demo car and slot assigned.
4. **Confirmation & AI calling**: WhatsApp confirmation, an AI call the evening before (Hinglish, reschedule), live tracking, handover at the gate, feedback and quote.

It ends with a programme analytics page and a thank-you slide. All figures are demo data.

## Use it

Live: https://freestandtech.github.io/drive_test/

Or open `index.html` in a browser. It is a single self-contained file (fonts load from Google Fonts when online). Next/Previous, the step bar, ← → keys, Home/End.

## Build

```sh
node build.mjs   # writes index.html (served by GitHub Pages) and dist/index.html
```

- `src/scenes.mjs`: the illustrated scenes (home, dealer map, showroom, AI call, handover, cover), built on the HUL CDP illustration kit in `kit/` (copied from `freestand_HUL_CDP/src/hul/scenes/kit.js`; one addition: `coatSleeve` for blazers).
- `src/car.mjs`: the Basalt X side-profile drawing.
- `src/app.js`, `src/styles.css`: the shell, phones (website, WhatsApp, dealer app, call) and data panels.
