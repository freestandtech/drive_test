// Builds index.html (served by GitHub Pages) and dist/index.html. CSS and JS are inlined; photos
// stay as files in assets/img (Renault's Duster campaign visuals, Pexels portraits, the problem
// screenshots), so open index.html from the repo folder or the live site.
import fs from 'fs';

const b64 = (f, mime) => `data:${mime};base64,${fs.readFileSync(f).toString('base64')}`;
const data = {
  img: {
    fs: b64('assets/freestand.png', 'image/png'),
    fsApp: b64('assets/freestand-app.png', 'image/png'),
    badge: b64('assets/whatsapp-verified-badge.svg', 'image/svg+xml'),
  },
};
const RL = 'm52.3 43-23 43H23L0 43 22.9 0h6.5L6.5 43l19.6 36.9L45.7 43 34.3 21.5l3.3-6.1zM42.5 0h-6.6L13.1 43l14.7 27.6 3.2-6.1L19.6 43 39.2 6l19.6 37-22.9 43h6.6l22.8-43z';
const css = fs.readFileSync('src/styles.css', 'utf8');
const js = fs.readFileSync('src/app.js', 'utf8');
const preload = fs.readdirSync('assets/img').map((f) => `<link rel="preload" as="image" href="assets/img/${f}">`).join('');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Renault Test Drive Demo</title>
<meta name="description" content="Every booked Renault test drive happens: booking, validation, dealer fulfilment, confirmation and AI calling, with analytics. A FreeStand demo.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Grand+Hotel&display=swap" rel="stylesheet">
${preload}
<style>${css}</style>
</head>
<body>
<div class="app">
  <aside class="rail">
    <div class="logo"><img src="${data.img.fs}" alt="FreeStand"><div>Test-drive demo · Renault</div></div>
    <div id="chapters"></div>
    <div class="foot"><span id="count"></span><br>← → keys to step through</div>
  </aside>
  <main class="main">
    <div class="head"><div id="head"></div><div class="lockup"><div class="rn"><svg viewBox="0 0 66 86"><path d="${RL}"/></svg>RENAULT</div><span class="x"></span><img src="${data.img.fs}" alt="FreeStand"></div></div>
    <div class="stage" id="stage"><div class="frame" id="frame"><div class="canvas" id="canvas"></div></div></div>
    <div class="bar"><button class="prev" id="prev"><svg class="i" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>Previous</button><div class="prog" id="prog"></div><div class="nextw"><div class="upnext" id="upnext"></div><button class="next" id="next">Next<svg class="i" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div></div>
  </main>
</div>
<div id="tip"></div>
<script>window.__DATA = ${JSON.stringify(data)};</script>
<script>${js}</script>
</body>
</html>`;
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('index.html', html);
fs.writeFileSync('dist/index.html', html.replaceAll('assets/img/', '../assets/img/'));
console.log('index.html', (html.length / 1024).toFixed(0) + ' KB');
