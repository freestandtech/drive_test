# Renault Duster · Test-drive demo

Live: https://freestandtech.github.io/drive_test/

A click-through demo in FreeStand UI. It follows one lead (Shubham Kohli, Rajouri Garden) through four stages:

1. **Booking**: Instagram ad → renault.co.in booking page → OTP → WhatsApp.
2. **Validation**: driving licence (OCR + Parivahan match), optional soft credit check, address quality score, intent and exchange enrichment → grade-A lead.
3. **Fulfilment**: offered to the 3 nearest Renault dealers; the first to accept wins (Kirti Nagar, 1 m 48 s); consultant, demo car and slot assigned.
4. **Confirmation & AI calling**: WhatsApp confirmation, an AI call the evening before (Hinglish, reschedule), live tracking, handover at the gate, feedback and quote.

It ends with programme analytics and a thank-you slide. All figures are demo data.

The WhatsApp chats play live (typing, taps, one message at a time) and each panel waits for the message it depends on. Next / Previous, the rail, ← → keys, Home / End; `#5` in the URL opens step 5.

## People

The characters are **Desi Log** illustrations by Juhi Chitra (https://desilog.in, CC BY 4.0), the human library used in the HUL CDP demo. Credit is shown on the rail and the closing slide; see `assets/desilog/LICENSE.md`.

## Build

```sh
node build.mjs   # writes index.html (served by GitHub Pages) and dist/index.html
```

- `src/scenes.mjs`: the illustrated scenes (home, dealer map, showroom, AI call, handover, cover).
- `kit/`: the HUL CDP scene kit (`kit.js`) and its v2 Desi Log people layer (`people.js`, `cast.js`).
- `src/car.mjs`: the Duster drawing and the Renault mark.
- `src/app.js`, `src/styles.css`: the FreeStand UI shell, the live chat engine, phones and panels.
