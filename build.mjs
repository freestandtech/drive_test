// Builds index.html (served by GitHub Pages) and dist/index.html: one self-contained file with the
// scenes, avatars, car drawings, logos and the Desi Log characters (embedded once, as a sprite).
import fs from 'fs';
import { renderScene, renderAvatar, drawingGeometry } from './src/scenes.mjs';
import { carSide } from './src/car.mjs';
import { PEOPLE, CREDIT } from './kit/cast.js';

const b64 = (f, mime) => `data:${mime};base64,${fs.readFileSync(f).toString('base64')}`;
const carSvg = (o) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -222 540 238" width="100%" style="display:block">${carSide(0, 0, o)}</svg>`;

const g = drawingGeometry();
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${Object.entries(PEOPLE)
  .map(([k, p]) => `<image id="dl-${k}" href="${b64(`assets/desilog/${p.file}`, 'image/webp')}" x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" preserveAspectRatio="none"/>`)
  .join('')}</defs></svg>`;

const data = {
  scenes: Object.fromEntries(['cover', 'ad', 'map', 'showroom', 'call', 'drive'].map((n) => [n, renderScene(n, n === 'map' ? { states: { kn: 'notified' } } : undefined)])),
  avatars: { shubham: renderAvatar('shubham'), ranjan: renderAvatar('ranjan', '#f1f2f4'), shubhamPlain: renderAvatar('shubham', '#dfe6ef') },
  car: { hero: carSvg({ id: 'heroCar' }), whiteSmall: carSvg({ id: 'demoCar', body: '#e9ecef', badge: false }) },
  img: {
    fs: b64('assets/freestand.png', 'image/png'),
    fsApp: b64('assets/freestand-app.png', 'image/png'),
    badge: b64('assets/whatsapp-verified-badge.svg', 'image/svg+xml'),
  },
};

const dia = `<svg width="18" height="18" viewBox="-9 -9 18 18"><path d="M0 -8.3L6.1 0L0 8.3L-6.1 0Z M0 -4.7L3.5 0L0 4.7L-3.5 0Z" fill="none" stroke="#efdf00" stroke-width="1.6"/></svg>`;
const css = fs.readFileSync('src/styles.css', 'utf8');
const js = fs.readFileSync('src/app.js', 'utf8');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Renault Test Drive Demo</title>
<meta name="description" content="Renault Duster test drive, end to end: booking, validation, dealer fulfilment, confirmation and AI calling. A FreeStand demo.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
${sprite}
<div class="app">
  <aside class="rail">
    <div class="logo"><img src="${data.img.fs}" alt="FreeStand"><div>Renault · test-drive demo</div></div>
    <div id="chapters"></div>
    <div class="foot"><div class="counter" id="counter"></div><div class="credit">${CREDIT.text.replace('desilog.in', `<a href="${CREDIT.href}" target="_blank" rel="noopener">desilog.in</a>`)}</div></div>
  </aside>
  <main class="main">
    <div class="head"><div id="head"></div><div class="brandlock"><div class="rn"><span>${dia}</span>RENAULT</div><span class="x">×</span><img src="${data.img.fs}" alt="FreeStand" style="height:15px"></div></div>
    <div class="stage" id="stage"><div class="frame" id="frame"><div class="canvas" id="canvas"></div></div></div>
    <div class="bar"><button class="prev" id="prev">← Previous</button><div class="chips-bar" id="chipsbar"></div><div class="nextw"><div class="upnext" id="upnext"></div><button class="next" id="next">Next →</button></div></div>
  </main>
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
