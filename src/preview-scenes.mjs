// Dev helper: writes each scene to <out>/<name>.html for a quick visual check.
import fs from 'fs';
import { renderScene } from './scenes.mjs';
const out = process.argv[2];
for (const [n, o] of [['cover'], ['ad'], ['map', { states: { kn: 'notified' } }], ['showroom'], ['call'], ['drive']])
  fs.writeFileSync(`${out}/${n}.html`, `<html><body style="margin:0">${renderScene(n, o)}</body></html>`);
