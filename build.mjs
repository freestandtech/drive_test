// Builds dist/index.html: one self-contained file (scenes, avatars, car drawings, logos inlined).
import fs from 'fs';
import { renderScene, avatar } from './src/scenes.mjs';
import { carSide } from './src/car.mjs';

const b64 = (f, mime) => `data:${mime};base64,${fs.readFileSync(f).toString('base64')}`;
const carSvg = (o) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -222 540 238" width="100%" style="display:block">${carSide(0, 0, o)}</svg>`;

const data = {
  scenes: Object.fromEntries(['cover', 'ad', 'map', 'showroom', 'call', 'drive'].map((n) => [n, renderScene(n, n === 'map' ? { states: { kn: 'notified' } } : undefined)])),
  avatars: {
    shubham: avatar('shubham'),
    ranjan: avatar('ranjan', '#eceef1'),
    shubhamPlain: avatar('shubham', '#dfe6ef'),
  },
  car: { red: carSvg({ id: 'heroCar', s: 1 }), whiteSmall: carSvg({ id: 'demoCar', body: '#e9ecef', badge: false }) },
  img: {
    fs: b64('assets/freestand.png', 'image/png'),
    fsApp: b64('assets/freestand-app.png', 'image/png'),
    badge: b64('assets/whatsapp-verified-badge.svg', 'image/svg+xml'),
  },
};

const css = fs.readFileSync('src/styles.css', 'utf8');
const js = fs.readFileSync('src/app.js', 'utf8');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Citroën Test Drive Demo</title>
<meta name="description" content="Basalt X test drive, end to end: booking, validation, dealer fulfilment, confirmation and AI calling. A FreeStand demo.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<div class="shell">
  <div class="top">
    <div><div class="eyebrow">Test-drive demo · Booking → Validation → Fulfilment → Confirmation</div>
      <div class="brandline"><div class="mark"><svg width="24" height="24" viewBox="-14 -13 28 26"><path d="M-12 -0.6L0 -6.6 12 -0.6M-12 8.4L0 2.4 12 8.4" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="square"/></svg></div><div class="t">CITROËN <span>— BASALT X TEST DRIVE</span></div></div></div>
    <div class="stages" id="stages"></div>
  </div>
  <div class="stagewrap"><div class="canvas" id="canvas"></div></div>
  <div class="nav">
    <div class="groups" id="groups"></div>
    <div class="segs" id="segs"></div>
    <div class="navrow"><button id="prev">← Previous</button><div class="hint" id="where"></div><button id="next" class="next">Next →</button></div>
  </div>
</div>
<div id="tip"></div>
<script>window.__DATA = ${JSON.stringify(data)};</script>
<script>${js}</script>
</body>
</html>`;
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html);
fs.writeFileSync('index.html', html); // served by GitHub Pages from the repo root
console.log('index.html + dist/index.html', (html.length / 1024).toFixed(0) + ' KB');
