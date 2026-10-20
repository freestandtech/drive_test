# Renault × FreeStand · test-drive demo

Live: https://freestandtech.github.io/drive_test/

A click-through demo that starts with the problem and then shows one Duster test drive end to end:

0. **The problem**: a real customer conversation (WhatsApp + X post, Ahmedabad, 19 Oct 2026), why test drives break, and what we solve.
1. **Booking**: Renault’s Instagram ad → renault.co.in → one-time code → WhatsApp.
2. **Validation**: driving licence (Parivahan match), optional soft credit check, address quality, intent → grade-A lead.
3. **Fulfilment**: the three nearest Renault dealers get the lead in a modal over the customer profile; the first to accept wins; consultant, demo car and slot assigned.
4. **Confirmation & AI calling**: WhatsApp confirmation, an AI call the evening before (English), live tracking on the day, a completed test drive with feedback.

Then programme analytics (test drives only, no sales) and a closing slide. All figures are demo data.

WhatsApp chats play live (typing, taps, one message at a time); each panel waits for the message it depends on. Next / Previous, the rail, ← → keys; `#5` opens step 5.

## Images

- `assets/img/duster-*.webp`: Renault’s own Duster campaign visuals, from renault.co.in (cdn.group.renault.com).
- `assets/img/customer.webp`, `consultant.webp`: Pexels photos 4307884 and 2505053 (Pexels licence). The names in the demo are fictional.
- `assets/img/problem-*.webp`: the customer screenshots shared for the demo; the X author’s name, handle and photo are blurred.

## Build

```sh
node build.mjs   # writes index.html (served by GitHub Pages) and dist/index.html
```

`src/app.js` holds the steps, the live chat engine, phones and panels; `src/styles.css` the FreeStand UI styles.
