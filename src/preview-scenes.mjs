// Dev helper: writes each scene to <out>/<name>.html (with the shared drawings) for a visual check.
import fs from 'fs';
import { renderScene, drawingGeometry } from './scenes.mjs';
import { PEOPLE } from '../kit/cast.js';
const out = process.argv[2];
const g = drawingGeometry();
const sprite = `<svg width="0" height="0" style="position:absolute"><defs>${Object.entries(PEOPLE).map(([k, p]) => `<image id="dl-${k}" href="data:image/webp;base64,${fs.readFileSync(new URL(`../assets/desilog/${p.file}`, import.meta.url)).toString('base64')}" x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" preserveAspectRatio="none"/>`).join('')}</defs></svg>`;
for (const [n, o] of [['cover'], ['ad'], ['map', { states: { kn: 'notified' } }], ['showroom'], ['call'], ['drive']])
  fs.writeFileSync(`${out}/${n}.html`, `<html><body style="margin:0">${sprite}${renderScene(n, o)}</body></html>`);
