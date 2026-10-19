// Scene illustration kit: the flat-vector language of the online-to-offline demo (navy location
// bar, labelled role characters, navy-bordered speech bubbles), as plain string builders.
// No DOM, no image imports: everything returns SVG markup, so the kit runs in Node tests too.
// Real pack shots, campaign images and logos are drawn with <image href="assets/…"> (served from
// public/assets). Coordinates: 1000-wide stage, floor line at y = 470, people stand on it.
import { BRANDS, packBrand } from './brands.js';

export const SC = {
  navy: '#0B2E6E',
  orange: '#FF6B00',
  yellow: '#FFC20E',
  wall: '#E8EEF6',
  floor: '#D8DFE8',
  floorLine: '#C9D2DE',
  ink: '#13203b',
  shoe: '#1b1c21',
  pants: '#4a4e5a',
  hair: '#1d1b1c',
  green: '#16a34a',
};
export const FLOOR = 470;
// Every template draws inside this window; the wall and floor planes run past it so a scene
// fills any card shape.
export const VIEWBOX = '40 -100 920 680';

export function shade(hex, pct) {
  const n = parseInt(String(hex).slice(1), 16);
  let r = n >> 16,
    g = (n >> 8) & 255,
    b = n & 255;
  const f = pct / 100;
  const adj = (v) => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f);
  r = adj(r);
  g = adj(g);
  b = adj(b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
// Text width for bold sans text (Arial/Helvetica-bold advance widths, a little generous), so
// bubbles and tags fit their text in any of the usual system fonts.
const CW = {};
' ijlI.,:;!|\'’'.split('').forEach((c) => (CW[c] = 0.3));
'ftr()-[]'.split('').forEach((c) => (CW[c] = 0.39));
'mM'.split('').forEach((c) => (CW[c] = 0.9));
'wW'.split('').forEach((c) => (CW[c] = 0.86));
'ABCDGHKNOQRUV&'.split('').forEach((c) => (CW[c] = 0.76));
'EFLPSTXYZ'.split('').forEach((c) => (CW[c] = 0.68));
'bdghnopqu'.split('').forEach((c) => (CW[c] = 0.62));
export const tW = (s, fs) => {
  let w = 0;
  for (const c of String(s)) w += CW[c] ?? 0.58;
  return w * fs * 1.02;
};
// Width of an all-caps bold line with letter spacing ls.
const capsW = (s, fs, ls = 1) => tW(s, fs) + String(s).length * ls;
const lineW = (l, fs, first) => (first && String(l) === String(l).toUpperCase() ? capsW(l, fs) : tW(l, fs) * 1.04);
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);

// Unique ids for clip paths and gradients inside one page.
let uid = 0;
const nid = (p) => `hsc-${p}${++uid}`;

// Wrap long lines at word boundaries so text never runs out of its bubble.
export function wrap(lines, max = 30) {
  const out = [];
  for (const l of [].concat(lines || [])) {
    const words = String(l).split(' ');
    let cur = '';
    for (const w of words) {
      if (cur && (cur + ' ' + w).length > max) {
        out.push(cur);
        cur = w;
      } else cur = cur ? cur + ' ' + w : w;
    }
    if (cur || !out.length) out.push(cur);
  }
  return out;
}

// Wrap so that no line is wider than maxW at font size fs.
export function wrapW(lines, fs, maxW) {
  const out = [];
  for (const l of [].concat(lines || [])) {
    let cur = '';
    for (const w of String(l).split(' ')) {
      if (cur && tW(cur + ' ' + w, fs) > maxW) {
        out.push(cur);
        cur = w;
      } else cur = cur ? cur + ' ' + w : w;
    }
    if (cur || !out.length) out.push(cur);
  }
  return out;
}

// ───────────────────────────── brands, packs, logos ─────────────────────────────
const LOGO_FILE = {
  surf: 'surf-excel.png',
  comfort: 'comfort.png',
  rin: 'rin.png',
  sunsilk: 'sunsilk.png',
  dove: 'dove.png',
  tresemme: 'tresemme.png',
  ponds: 'ponds.png',
  pears: 'pears.png',
  lux: 'lux.png',
  simple: 'simple.png',
  lakme: 'lakme.png',
  horlicks: 'horlicks.png',
  horlicks_mp: 'horlicks-mothers-plus.png',
  horlicks_dp: 'horlicks.png',
  horlicks_pp: 'horlicks.png',
  bebeautiful: 'be-beautiful.png',
  vaseline: 'vaseline.png',
  hul: 'hul.svg',
};
// width / height of each logo file
const LOGO_AR = {
  surf: 164 / 240,
  comfort: 307 / 120,
  rin: 136 / 240,
  sunsilk: 287 / 240,
  dove: 302 / 139,
  tresemme: 1,
  ponds: 270 / 77,
  pears: 209 / 69,
  lux: 203 / 106,
  simple: 320 / 201,
  lakme: 181 / 52,
  horlicks: 1,
  horlicks_mp: 246 / 110,
  horlicks_dp: 1,
  horlicks_pp: 1,
  bebeautiful: 300 / 147,
  vaseline: 300 / 231,
  hul: 400 / 49,
};
export const PARTNERS = {
  blinkit: { file: 'blinkit.png', name: 'Blinkit', bg: '#f8cb46', fg: '#0c831f' },
  zepto: { file: 'zepto.png', name: 'Zepto', bg: '#5a1e8c', fg: '#fff' },
  instamart: { file: 'instamart.png', name: 'Instamart', bg: '#fc8019', fg: '#fff' },
  amazon: { file: 'amazon.ico', name: 'Amazon', bg: '#232f3e', fg: '#ff9900' },
  whatsapp: { file: 'whatsapp.svg', name: 'WhatsApp', bg: '#25d366', fg: '#fff' },
  meta: { file: 'meta.svg', name: 'Meta', bg: '#0866ff', fg: '#fff' },
  instagram: { file: 'instagram.png', name: 'Instagram', bg: '#d62976', fg: '#fff' },
  google: { file: 'google-ads.svg', name: 'Google Ads', bg: '#4285f4', fg: '#fff' },
  youtube: { file: 'youtube.svg', name: 'YouTube', bg: '#ff0000', fg: '#fff' },
  snowflake: { file: 'snowflake.svg', name: 'Snowflake', bg: '#29b5e8', fg: '#fff' },
  liveramp: { file: 'liveramp.png', name: 'LiveRamp', bg: '#0f2b46', fg: '#fff' },
  infosum: { file: 'infosum.png', name: 'InfoSum', bg: '#1b1f3b', fg: '#fff' },
  databricks: { file: 'databricks.png', name: 'Databricks', bg: '#ff3621', fg: '#fff' },
  bigbasket: { file: 'bigbasket.png', name: 'BigBasket', bg: '#84c225', fg: '#fff' },
};
const PACK_KEYS = new Set(['comfort', 'dove', 'dove_bodywash', 'horlicks', 'horlicks_mp', 'lakme', 'lux', 'pears', 'ponds', 'rin', 'simple', 'sunsilk', 'surf', 'tresemme', 'vaseline']);
const PACK_ALIAS = { horlicks_dp: 'horlicks', horlicks_pp: 'horlicks' };
export const packKey = (k) => (PACK_KEYS.has(k) ? k : PACK_ALIAS[k] || null);
const SCENE_KEYS = new Set(['comfort', 'dove', 'horlicks', 'horlicks_dp', 'horlicks_mp', 'horlicks_pp', 'lakme', 'lux', 'pears', 'ponds', 'rin', 'simple', 'sunsilk', 'surf', 'tresemme', 'vaseline']);

// A brand's display name, colours and logo; unknown keys fall back to a neutral HUL look. A
// product pack key (dove_bodywash) resolves to its brand.
export function brandOf(k) {
  k = packBrand(k);
  const b = BRANDS[k];
  if (!b) return { key: 'hul', name: 'Hindustan Unilever', bg: '#1f36c7', fg: '#fff', accent: '#9fb2ff', logo: 'assets/logos/hul.svg', ar: LOGO_AR.hul };
  return { key: k, ...b, logo: 'assets/logos/' + (LOGO_FILE[k] || 'hul.svg'), ar: LOGO_AR[k] || 1 };
}

// A logo fitted (contain) into the box x, y, w, h.
export function logoImg(k, x, y, w, h) {
  const b = brandOf(k);
  let lw = w,
    lh = w / b.ar;
  if (lh > h) {
    lh = h;
    lw = h * b.ar;
  }
  return `<image href="${b.logo}" x="${x + (w - lw) / 2}" y="${y + (h - lh) / 2}" width="${lw}" height="${lh}" preserveAspectRatio="xMidYMid meet"/>`;
}
// A logo on a white plate. The HUL wordmark is white, so it sits on HUL blue.
export function logoPlate(k, x, y, w, h, o = {}) {
  k = packBrand(k);
  const hul = k === 'hul' || !BRANDS[k];
  const pad = o.pad ?? Math.min(w, h) * 0.14;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? Math.min(10, h / 3)}" fill="${hul ? '#1f36c7' : '#fff'}"${o.stroke ? ` stroke="${o.stroke}"` : ''}/>${logoImg(hul ? 'hul' : k, x + pad, y + pad, w - pad * 2, h - pad * 2)}</g>`;
}
export function partnerLogo(p, x, y, w, h) {
  const q = PARTNERS[p];
  if (!q) return '';
  return `<image href="assets/logos/${q.file}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
}

// Where the product sits inside each 300 × 356 pack shot: body [x0, x1], top, and the
// cap or pump [nx0, nx1] down to the shoulder. The clip keeps the backdrop out.
const PACK_CROP = {
  surf: [79, 247, 37, 115, 173, 118],
  ponds: [78, 222, 37],
  comfort: [90, 198, 47, 118, 180, 105],
  rin: [14, 295, 37],
  dove: [89, 207, 47, 118, 175, 194],
  dove_bodywash: [86, 214, 30, 104, 196, 92],
  horlicks: [77, 222, 37],
  sunsilk: [59, 242, 19, 100, 185, 126],
  tresemme: [75, 230, 40, 72, 160, 95],
  lux: [0, 300, 95],
  pears: [83, 220, 37, 105, 170, 100],
  simple: [68, 228, 37, 112, 182, 98],
  lakme: [137, 164, 37],
  horlicks_mp: [27, 270, 40],
  // Intensive Care Deep Moisture lotion: the yellow bottle with its pump (the packs either side are cut).
  vaseline: [83, 220, 12, 94, 198, 76],
};
// Width a pack takes at height h.
export function packW(k, h) {
  const pk = packKey(k);
  if (!pk) return h * 1.16;
  const [x0, x1, top] = PACK_CROP[pk];
  return ((x1 - x0) * h) / (356 - top);
}
// The real pack shot, standing with its base centre at (cx, by), h tall.
export function packImg(k, cx, by, h, o = {}) {
  const pk = packKey(k);
  if (!pk) return bbBox(cx - h * 0.5, by, h, o);
  const [x0, x1, top, nx0, nx1, sh] = PACK_CROP[pk];
  const s = h / (356 - top);
  const ix = cx - ((x0 + x1) / 2) * s,
    iy = by - 356 * s;
  const id = nid('pk');
  const r = Math.min(12, (x1 - x0) * 0.09) * s;
  const body = `<rect x="${ix + x0 * s}" y="${iy + (sh || top) * s}" width="${(x1 - x0) * s}" height="${(356 - (sh || top)) * s}" rx="${r}"/>`;
  const neck = nx0 != null ? `<rect x="${ix + nx0 * s}" y="${iy + top * s}" width="${(nx1 - nx0) * s}" height="${(sh - top + 8) * s}" rx="${r * 0.6}"/>` : '';
  const shadow = o.shadow === false ? '' : `<ellipse cx="${cx}" cy="${by}" rx="${(x1 - x0) * s * 0.55}" ry="${Math.max(2, h * 0.04)}" fill="#0b2e6e" opacity=".14"/>`;
  return `<g class="${o.cls || ''}" style="${o.style || ''}">${shadow}<clipPath id="${id}">${body}${neck}</clipPath><image href="assets/hul/packs/${pk}.webp" x="${ix}" y="${iy}" width="${300 * s}" height="${356 * s}" clip-path="url(#${id})" preserveAspectRatio="none"/></g>`;
}
// The brand's campaign photo, cropped to fill x, y, w, h.
export function scenePhoto(k, x, y, w, h, r = 6) {
  const sk = SCENE_KEYS.has(packBrand(k)) ? packBrand(k) : packKey(k);
  const id = nid('ph');
  if (!sk) return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${brandOf(k).bg}"/>${logoImg(k, x + w * 0.2, y + h * 0.25, w * 0.6, h * 0.5)}`;
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath><image href="assets/hul/scenes/${sk}.webp" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
}

// The Be Beautiful sampling box (left x, bottom by, width w); o.mini adds the MINI flash.
export function bbBox(x, by, w = 60, o = {}) {
  const h = w * 0.74,
    y = by - h,
    d = w * 0.16;
  let s = `<g class="${o.cls || ''}" style="${o.style || ''}"><path d="M${x} ${y}l${d} -${d * 0.7}h${w}l-${d} ${d * 0.7}z" fill="#3a3a3a"/><path d="M${x + w} ${y}l${d} -${d * 0.7}v${h}l-${d} ${d * 0.7}z" fill="#0f0f0f"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#1d1d1d"/>
    ${[0.18, 0.34, 0.5].map((k) => `<rect x="${x + w * 0.08}" y="${y + h * k}" width="${w * (0.5 + k * 0.5)}" height="${h * 0.035}" fill="#2e2e2e"/>`).join('')}
    <rect x="${x + w * 0.2}" y="${y + h * 0.6}" width="${w * 0.62}" height="${h * 0.28}" fill="#fff"/>
    <text x="${x + w * 0.24}" y="${y + h * 0.72}" font-family="Georgia,serif" font-size="${w * 0.1}" fill="#111">Be</text>
    <text x="${x + w * 0.24}" y="${y + h * 0.84}" font-family="Georgia,serif" font-size="${w * 0.1}" fill="#111">beautiful</text>`;
  if (o.mini) s += `<rect x="${x + w * 0.62}" y="${y + h * 0.07}" width="${w * 0.3}" height="${h * 0.17}" rx="2" fill="#d71920"/><text x="${x + w * 0.77}" y="${y + h * 0.2}" text-anchor="middle" font-size="${w * 0.08}" font-weight="800" fill="#fff">MINI</text>`;
  if (o.num) s += `<text x="${x + w * 0.08}" y="${y + h * 0.13}" font-size="${w * 0.1}" font-weight="700" fill="#fff">${esc(o.num)}</text>`;
  return s + '</g>';
}
// A brand's pack: the real pack shot, or the Be Beautiful box.
export const brandPack = (k, cx, by, h, o = {}) => (packKey(k) ? packImg(k, cx, by, h, o) : bbBox(cx - h * 0.5, by, h, o));

// A cardboard parcel (left x, bottom by, width w) with the brand's logo label and a QR slip.
export function parcel(x, by, w, k, o = {}) {
  const h = w * 0.62,
    y = by - h,
    d = w * 0.14;
  if (k === 'bebeautiful' && !o.carton) return bbBox(x, by, w, o);
  return `<g class="${o.cls || ''}" style="${o.style || ''}"><path d="M${x} ${y}l${d} -${d * 0.7}h${w}l-${d} ${d * 0.7}z" fill="#d8b489"/><path d="M${x + w} ${y}l${d} -${d * 0.7}v${h}l-${d} ${d * 0.7}z" fill="#a67c4f"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c69c6d"/><rect x="${x + w * 0.44}" y="${y}" width="${w * 0.12}" height="${h}" fill="#b98d5c" opacity=".7"/>
    ${logoPlate(k, x + w * 0.08, y + h * 0.16, w * 0.34, h * 0.36, { r: 3 })}
    <rect x="${x + w * 0.6}" y="${y + h * 0.18}" width="${w * 0.32}" height="${h * 0.64}" rx="2" fill="#fff"/>${qrIn(x + w * 0.63, y + h * 0.22, w * 0.26, o.seed || 17)}
    ${o.label ? `<text x="${x + w * 0.08}" y="${y + h * 0.82}" font-size="${w * 0.075}" font-weight="800" fill="#4b3621">${esc(o.label)}</text>` : ''}</g>`;
}

// ───────────────────────────── scene furniture (ported) ─────────────────────────────
export function bgPlane(h = FLOOR, wall = SC.wall, floor = SC.floor, line = SC.floorLine) {
  return `<rect x="-3000" y="-3000" width="7000" height="${3000 + h}" fill="${wall}"/><rect x="-3000" y="${h}" width="7000" height="3000" fill="${floor}"/><rect x="-3000" y="${h}" width="7000" height="3" fill="${line}"/>`;
}

// Speech bubble: navy border, tail toward the speaker. o.fs/o.lh size the text, o.tx aims the tail,
// o.label sits above the bubble.
export function bubble(x, y, lines, o = {}) {
  const fs = o.fs || 22,
    lh = o.lh || Math.round(fs * 1.32),
    px = 20,
    py = 15;
  const w = o.w || Math.ceil(Math.max(...lines.map((l) => tW(l, fs)))) + px * 2;
  const h = bubbleH(lines.length, fs, lh);
  const tx = Math.min(Math.max(o.tx ?? x + 70, x + 28), x + w - 28);
  const r = 15,
    th = 18;
  const d = `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${tx + 11}L${tx} ${y + h + th}L${tx - 11} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  const txt = lines.map((l, i) => `<text x="${x + px}" y="${y + py + fs - 3 + i * lh}" font-size="${fs}" font-weight="700" fill="${SC.ink}">${esc(l)}</text>`).join('');
  const label = o.label ? `<text x="${x + px}" y="${y - 8}" font-size="13" font-weight="800" letter-spacing="1.5" fill="${o.labelInk || SC.navy}">${esc(String(o.label).toUpperCase())}</text>` : '';
  return `<g class="${o.cls || ''}" style="${o.style || ''}">${label}<path d="${d}" fill="${o.fill || '#fff'}" stroke="${o.stroke || SC.navy}" stroke-width="3.5" stroke-linejoin="round"/>${txt}</g>`;
}
export const bubbleH = (n, fs = 22, lh = Math.round(fs * 1.32)) => n * lh + 30 - (lh - fs) + 3;
export const bubbleW = (lines, fs = 22) => Math.ceil(Math.max(...lines.map((l) => tW(l, fs)))) + 40;

// A highlight tag (rounded, filled): first line bold caps, the rest smaller.
export function hlTag(x, y, lines, o = {}) {
  const f0 = o.fs || 16,
    f1 = f0 - 2,
    lh = f0 + 5;
  const w = o.w || hlTagW(lines, f0);
  const h = 18 + lines.length * lh;
  return `<g class="${o.cls || ''}" style="${o.style || ''}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="11" fill="${o.bg || SC.navy}"/>${lines
    .map(
      (l, i) =>
        `<text x="${x + 15}" y="${y + 9 + f0 + i * lh}" font-size="${i ? f1 : f0}" font-weight="${i ? 600 : 800}" fill="${i ? o.sub || '#dbe6ff' : '#fff'}" letter-spacing="${i ? 0.3 : 1}">${esc(l)}</text>`,
    )
    .join('')}</g>`;
}
export const hlTagW = (lines, fs = 16) => Math.max(...lines.map((l, i) => lineW(l, i ? fs - 2 : fs, !i))) + 30;

// A green "verified" pill with a tick.
export function okPill(x, y, title, sub, o = {}) {
  const w = o.w || Math.max(capsW(title, 14), tW(sub || '', 13) * 1.04) + 66;
  return `<g class="${o.cls || ''}" style="${o.style || ''}"><rect x="${x}" y="${y}" width="${w}" height="50" rx="25" fill="${o.bg || SC.green}"/><circle cx="${x + 26}" cy="${y + 25}" r="15" fill="#fff"/><path d="M${x + 19} ${y + 25}l5 5 9 -10" stroke="${o.bg || SC.green}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${x + 50}" y="${y + 22}" font-size="14" font-weight="800" fill="#fff" letter-spacing="1">${esc(title)}</text>${sub ? `<text x="${x + 50}" y="${y + 39}" font-size="13" font-weight="600" fill="#dcfce7">${esc(sub)}</text>` : ''}</g>`;
}

export function desk(x1, x2, top = 336, col = '#c9986b') {
  return `<g><rect x="${x1}" y="${top}" width="${x2 - x1}" height="14" rx="3" fill="${col}"/><rect x="${x1 + 8}" y="${top + 14}" width="${x2 - x1 - 16}" height="${FLOOR - top - 14}" fill="${shade(col, -16)}"/>
    <rect x="${x1 + 8}" y="${top + 14}" width="${x2 - x1 - 16}" height="8" fill="${shade(col, -26)}" opacity=".5"/>
    <line x1="${(x1 + x2) / 2}" y1="${top + 40}" x2="${(x1 + x2) / 2}" y2="${FLOOR - 4}" stroke="${shade(col, -24)}" stroke-width="2"/></g>`;
}
export function frameCert(x, y, w, h) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#6f4d2c"/><rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="#fbf7ee"/>
    <rect x="${x + w / 2 - 14}" y="${y + 12}" width="28" height="3" fill="#b89c6a"/><rect x="${x + 12}" y="${y + 22}" width="${w - 24}" height="2.5" fill="#c9c2b3"/><rect x="${x + 16}" y="${y + 29}" width="${w - 32}" height="2.5" fill="#c9c2b3"/>
    <circle cx="${x + w - 16}" cy="${y + h - 16}" r="6" fill="#d9a441"/></g>`;
}
export function wallClock(cx, cy, hh, mm, r = 26) {
  const ha = ((hh % 12) + mm / 60) * 30,
    ma = mm * 6;
  const hand = (a, l, w) =>
    `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin((a * Math.PI) / 180) * l}" y2="${cy - Math.cos((a * Math.PI) / 180) * l}" stroke="${SC.ink}" stroke-width="${w}" stroke-linecap="round"/>`;
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    ticks += `<line x1="${cx + Math.sin(a) * (r - 7)}" y1="${cy - Math.cos(a) * (r - 7)}" x2="${cx + Math.sin(a) * (r - 3)}" y2="${cy - Math.cos(a) * (r - 3)}" stroke="#94a3b8" stroke-width="2"/>`;
  }
  return `<g><circle cx="${cx}" cy="${cy}" r="${r + 3}" fill="${SC.navy}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>${ticks}${hand(ha, r * 0.5, 3.5)}${hand(ma, r * 0.75, 2.5)}<circle cx="${cx}" cy="${cy}" r="2.5" fill="${SC.orange}"/></g>`;
}
export function plant(cx, by, s = 1, pot = '#b5532a') {
  return `<g transform="translate(${cx} ${by}) scale(${s})"><path d="M-22 0l-4 -34h52l-4 34z" fill="${pot}"/><rect x="-28" y="-40" width="56" height="8" rx="2" fill="${shade(pot, -14)}"/>
    <path d="M0 -40C-4 -70 -30 -80 -34 -66C-26 -64 -12 -58 -2 -42Z M0 -40C4 -76 28 -86 34 -72C26 -68 10 -60 2 -42Z M0 -42C-2 -84 8 -104 16 -98C10 -86 4 -66 2 -42Z" fill="#4c9a4c"/></g>`;
}
// Tulsi in its square planter, outside a house.
export function tulsi(cx, by, s = 1) {
  return `<g transform="translate(${cx} ${by}) scale(${s})"><rect x="-30" y="-62" width="60" height="62" fill="#e7c9a0"/><rect x="-36" y="-70" width="72" height="10" fill="#d2a874"/><rect x="-30" y="-48" width="60" height="6" fill="#c0392b" opacity=".7"/>
    <path d="M0 -70C-2 -96 -22 -108 -26 -96C-16 -94 -8 -86 -2 -72Z M0 -70C2 -100 22 -110 26 -98C16 -96 8 -86 2 -72Z M0 -72C0 -110 6 -124 12 -118C6 -106 4 -90 2 -72Z" fill="#3f8a3f"/></g>`;
}

export function qrSVG(seed = 7, n = 25) {
  let x = (seed * 9973) % 2147483647;
  const rnd = () => (x = (x * 48271) % 2147483647) / 2147483647;
  const on = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) on[r][cc] = rnd() > 0.52 ? 1 : 0;
  const finder = (r0, c0) => {
    for (let r = -1; r < 8; r++)
      for (let cc = -1; cc < 8; cc++) {
        const rr = r0 + r,
          c2 = c0 + cc;
        if (rr < 0 || c2 < 0 || rr >= n || c2 >= n) continue;
        const edge = r === -1 || cc === -1 || r === 7 || cc === 7;
        const ring = r === 0 || cc === 0 || r === 6 || cc === 6;
        const core = r >= 2 && r <= 4 && cc >= 2 && cc <= 4;
        on[rr][c2] = edge ? 0 : ring || core ? 1 : 0;
      }
  };
  finder(0, 0);
  finder(0, n - 7);
  finder(n - 7, 0);
  let d = '';
  for (let r = 0; r < n; r++) {
    let cc = 0;
    while (cc < n) {
      if (on[r][cc]) {
        let e = cc;
        while (e < n && on[r][e]) e++;
        d += `M${cc} ${r}h${e - cc}v1h-${e - cc}z`;
        cc = e;
      } else cc++;
    }
  }
  return `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><path d="${d}" fill="#111"/></svg>`;
}
export const qrIn = (x, y, w, seed = 21) => qrSVG(seed, 21).replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${w}" `);

export const sceneDefs = `<defs><filter id="hsc-psh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0b2e6e" flood-opacity=".18"/></filter></defs>`;

// A red (or brand) shelf badge.
export const shelfBadge = (x, y, text, w, cls = '', col = '#d71920') =>
  `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="22" rx="3" fill="${col}"/><text x="${x + w / 2}" y="${y + 15.5}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" letter-spacing="1.1">${esc(text)}</text></g>`;

// Store shelving (x, top y, width w, height h) with rows of generic packs. o.rows (default 3),
// o.skip = { row, from, to } leaves a gap for the brand's own packs.
export function shelves(x, y, w, h, o = {}) {
  const cols = ['#f59e0b', '#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#fbbf24', '#94a3b8', '#fca5a5', '#5eead4', '#fdba74', '#93c5fd', '#86efac'];
  let seed = o.seed || 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const rows = o.rows || 3,
    frame = o.frame || '#c9a27a';
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${frame}"/><rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 14}" fill="${o.back || '#f4eee5'}"/>`;
  const rh = (h - 14) / rows;
  for (let r = 0; r < rows; r++) {
    const bot = y + 10 + rh * (r + 1) - 6,
      top = bot - rh + 12;
    s += `<rect x="${x + 10}" y="${bot}" width="${w - 20}" height="9" fill="${shade(frame, -12)}"/>`;
    let px = x + 18;
    while (px < x + w - 24) {
      const pw = 16 + Math.round(rnd() * 22),
        ph = Math.min(bot - top - 6, 28 + Math.round(rnd() * 34));
      if (px + pw > x + w - 14) break;
      const sk = o.skip && o.skip.row === r && px + pw > o.skip.from && px < o.skip.to;
      if (!sk)
        s += `<rect x="${px}" y="${bot - ph}" width="${pw}" height="${ph}" rx="2" fill="${cols[Math.floor(rnd() * cols.length)]}"/><rect x="${px + 3}" y="${bot - ph + 6}" width="${pw - 6}" height="5" rx="1" fill="#fff" opacity=".7"/>`;
      else rnd(), rnd(), rnd();
      px += pw + 3 + Math.round(rnd() * 3);
    }
  }
  return s;
}
// The y of the shelf board under row r of shelves(x, y, w, h, {rows}).
export const shelfY = (y, h, r, rows = 3) => y + 10 + ((h - 14) / rows) * (r + 1) - 6;

// A row of the brand's packs on a shelf from x1 to x2, bottoms at by.
export function packRow(k, x1, x2, by, h) {
  const w = packW(k, h) + 6;
  const n = Math.max(1, Math.floor((x2 - x1) / w));
  const off = x1 + (x2 - x1 - n * w) / 2 + w / 2;
  return Array.from({ length: n }, (_, i) => brandPack(k, off + i * w, by, h, { shadow: false })).join('');
}

// Sachet strips hanging from a rail: the kirana look.
export function sachets(x, y, n = 6, o = {}) {
  const cols = o.cols || ['#1653a8', '#b0185a', '#1784c7', '#6b3fa0', '#f39200', '#2f7d4a', '#c62a2f'];
  let s = `<rect x="${x - 10}" y="${y - 6}" width="${n * 30 + 14}" height="5" rx="2" fill="#8a6a44"/>`;
  for (let i = 0; i < n; i++) {
    const c = cols[i % cols.length],
      len = 4 + ((i * 7) % 3);
    for (let j = 0; j < len; j++)
      s += `<rect x="${x + i * 30}" y="${y + j * 21}" width="20" height="19" rx="2" fill="${c}"/><rect x="${x + i * 30 + 3}" y="${y + j * 21 + 6}" width="14" height="5" rx="1" fill="#fff" opacity=".75"/>`;
  }
  return s;
}

// Counter front with glass display boxes (x1 to x2, top at 336).
export function counterFront(x1 = 96, x2 = 706, o = {}) {
  const cols = ['#60a5fa', '#34d399', '#a78bfa', '#fca5a5', '#fbbf24', '#94a3b8'];
  const n = o.n || 3,
    cw = (x2 - x1 - 16 - (n - 1) * 18) / n;
  return `<rect x="${x1}" y="336" width="${x2 - x1}" height="15" rx="3" fill="${o.top || '#eef2f7'}"/><rect x="${x1}" y="349" width="${x2 - x1}" height="3" fill="#c3cfdd"/>
    <rect x="${x1 + 8}" y="352" width="${x2 - x1 - 16}" height="118" fill="${o.body || '#d5dfea'}"/>
    ${Array.from({ length: n }, (_, i) => {
      const cx = x1 + 22 + i * (cw + 18);
      return `<rect x="${cx}" y="364" width="${cw - 12}" height="84" rx="3" fill="#e9f1f8" stroke="#c3cfdd" stroke-width="2"/>
      <rect x="${cx + 12}" y="414" width="${Math.min(34, cw * 0.2)}" height="30" rx="2" fill="${cols[i % 6]}" opacity=".8"/><rect x="${cx + 12 + cw * 0.25}" y="418" width="${cw * 0.28}" height="26" rx="2" fill="${cols[(i + 3) % 6]}" opacity=".8"/><rect x="${cx + cw * 0.62}" y="410" width="${cw * 0.18}" height="34" rx="2" fill="${cols[(i + 2) % 6]}" opacity=".8"/>
      <path d="M${cx + 10} 370l40 0-30 30z" fill="#fff" opacity=".45"/>`;
    }).join('')}`;
}

// ───────────────────────────── phones and devices ─────────────────────────────
// What a phone screen shows, drawn into x, y, w, h: 'wa' WhatsApp chat, 'call' a call,
// 'qr' a QR, 'ad' the brand's ad, 'app' the FreeStand app, 'ok' a green tick, 'bill' the camera
// framing a paper bill, 'wheel' a prize wheel in the brand's colours, or a colour.
export function screen(kind, x, y, w, h, k) {
  const b = brandOf(k);
  if (kind === 'wa')
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#efe7dd"/><rect x="${x}" y="${y}" width="${w}" height="${h * 0.18}" fill="#075e54"/><rect x="${x + w * 0.1}" y="${y + h * 0.28}" width="${w * 0.62}" height="${h * 0.14}" rx="2" fill="#fff"/><rect x="${x + w * 0.3}" y="${y + h * 0.48}" width="${w * 0.6}" height="${h * 0.12}" rx="2" fill="#d9fdd3"/><rect x="${x + w * 0.1}" y="${y + h * 0.66}" width="${w * 0.7}" height="${h * 0.16}" rx="2" fill="#fff"/>`;
  if (kind === 'call')
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1e293b"/><circle cx="${x + w / 2}" cy="${y + h * 0.34}" r="${w * 0.22}" fill="${b.bg}"/><rect x="${x + w * 0.2}" y="${y + h * 0.6}" width="${w * 0.6}" height="${h * 0.05}" fill="#94a3b8"/><circle cx="${x + w / 2}" cy="${y + h * 0.82}" r="${w * 0.15}" fill="#ef4444"/>`;
  if (kind === 'qr') return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/>${qrIn(x + w * 0.08, y + (h - w * 0.84) / 2, w * 0.84, 41)}`;
  if (kind === 'ad') return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${b.bg}"/>${scenePhoto(k, x, y + h * 0.12, w, h * 0.5, 1)}<rect x="${x + w * 0.12}" y="${y + h * 0.74}" width="${w * 0.76}" height="${h * 0.13}" rx="2" fill="#fff"/>`;
  if (kind === 'app')
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f4f7fb"/><rect x="${x}" y="${y}" width="${w}" height="${h * 0.2}" fill="${SC.navy}"/><rect x="${x + w * 0.1}" y="${y + h * 0.3}" width="${w * 0.8}" height="${h * 0.12}" rx="2" fill="#fff" stroke="#cbd5e1"/><rect x="${x + w * 0.1}" y="${y + h * 0.48}" width="${w * 0.8}" height="${h * 0.12}" rx="2" fill="#fff" stroke="#cbd5e1"/><rect x="${x + w * 0.1}" y="${y + h * 0.76}" width="${w * 0.8}" height="${h * 0.13}" rx="2" fill="${SC.navy}"/>`;
  if (kind === 'ok')
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f0fdf4"/><circle cx="${x + w / 2}" cy="${y + h / 2}" r="${w * 0.3}" fill="${SC.green}"/><path d="M${x + w * 0.36} ${y + h / 2}l${w * 0.1} ${w * 0.1} ${w * 0.18} -${w * 0.2}" stroke="#fff" stroke-width="${w * 0.08}" fill="none" stroke-linecap="round"/>`;
  // 'bill': the camera framing a paper bill or invoice (a photo being taken for upload)
  if (kind === 'bill')
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#334155"/><rect x="${x + w * 0.16}" y="${y + h * 0.1}" width="${w * 0.68}" height="${h * 0.8}" fill="#fff"/>${[0.2, 0.32, 0.42, 0.52, 0.62, 0.76].map((f, i) => `<rect x="${x + w * 0.24}" y="${y + h * f}" width="${w * (i === 0 || i === 5 ? 0.3 : 0.52)}" height="${Math.max(1.2, h * 0.035)}" fill="${i === 5 ? '#334155' : '#94a3b8'}"/>`).join('')}<path d="M${x + w * 0.06} ${y + h * 0.16}v-${h * 0.1}h${w * 0.16}M${x + w * 0.94} ${y + h * 0.16}v-${h * 0.1}h-${w * 0.16}M${x + w * 0.06} ${y + h * 0.84}v${h * 0.1}h${w * 0.16}M${x + w * 0.94} ${y + h * 0.84}v${h * 0.1}h-${w * 0.16}" stroke="#facc15" stroke-width="${Math.max(1.2, w * 0.05)}" fill="none"/>`;
  if (kind === 'wheel') {
    // a prize wheel in the brand's colours, pointer on top, spin button below
    const cx = x + w / 2,
      cy = y + h * 0.42,
      r = w * 0.42;
    const cols = [b.bg, '#fff', b.accent || '#fbbf24', '#fff', b.bg, b.accent || '#fbbf24'];
    const seg = cols
      .map((c, i) => {
        const a0 = (i * Math.PI) / 3,
          a1 = ((i + 1) * Math.PI) / 3;
        return `<path d="M${cx} ${cy}L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)}A${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}Z" fill="${c}"/>`;
      })
      .join('');
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fdeef3"/>${seg}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${b.bg}" stroke-width="${w * 0.05}"/><circle cx="${cx}" cy="${cy}" r="${w * 0.07}" fill="#fff" stroke="${b.bg}"/><path d="M${cx - w * 0.08} ${cy - r - w * 0.06}h${w * 0.16}l-${w * 0.08} ${w * 0.14}z" fill="#111827"/><rect x="${x + w * 0.16}" y="${y + h * 0.78}" width="${w * 0.68}" height="${h * 0.12}" rx="${h * 0.06}" fill="${b.bg}"/>`;
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${kind || '#bfe3cf'}"/>`;
}
// A smartphone held in a hand at (hx, hy). o.big for a phone held up to the viewer.
export function handPhone(hx, hy, kind = '#bfe3cf', dx = 4, k, o = {}) {
  const w = o.w || 26,
    h = o.h || 48;
  return `<g><rect x="${hx + dx}" y="${hy - h + 4}" width="${w}" height="${h}" rx="4" fill="#111827"/>${screen(kind, hx + dx + 3, hy - h + 8, w - 6, h - 8, k)}</g>`;
}
// A keypad phone (bar phone), centred at (cx, cy), rotated by rot.
export function keypadPhone(cx, cy, rot = 0, s = 1) {
  let keys = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) keys += `<rect x="${-8 + c * 6}" y="${4 + r * 5}" width="4" height="3" rx="1" fill="#cbd5e1"/>`;
  return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})"><rect x="-11" y="-24" width="22" height="50" rx="5" fill="#334155"/><rect x="-8" y="-20" width="16" height="17" rx="1.5" fill="#a7f3d0"/><rect x="-6" y="-17" width="9" height="2" fill="#047857"/><rect x="-6" y="-12" width="12" height="2" fill="#047857"/>${keys}</g>`;
}
// A tablet held in a hand at (hx, hy), screen toward the viewer.
export function handTablet(hx, hy, k, o = {}) {
  const w = o.w || 58,
    h = o.h || 74;
  const x = hx - w / 2 + (o.dx || 0),
    y = hy - h + 18;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#1f2937"/><rect x="${x + 4}" y="${y + 5}" width="${w - 8}" height="${h - 10}" rx="2" fill="#f4f7fb"/><rect x="${x + 4}" y="${y + 5}" width="${w - 8}" height="13" fill="${SC.navy}"/><text x="${x + 8}" y="${y + 14.5}" font-size="7" font-weight="800" fill="#fff">FreeStand Field</text>
    <rect x="${x + 9}" y="${y + 24}" width="${w - 18}" height="9" rx="2" fill="#fff" stroke="#cbd5e1"/><rect x="${x + 9}" y="${y + 37}" width="${w - 18}" height="9" rx="2" fill="#fff" stroke="#cbd5e1"/><rect x="${x + 9}" y="${y + h - 22}" width="${w - 18}" height="10" rx="2" fill="${o.ok ? SC.green : SC.navy}"/></g>`;
}

// ───────────────────────────── people ─────────────────────────────
// A labelled role character. o: x, y (feet), s (scale), skin, hair, hairStyle ('long' | 'bun' |
// 'pony' | 'short' | 'grey' | 'braid'), shirt, pants, shoes, saree (true or colour), blouse,
// border, kurta, dupatta, headCover, bindi, mustache, beard, glasses, coat, vest (colour) +
// vestText, cap, helmet, bag, satchel, shorts, jersey, mud, sit, label, labelInk, armL/armR
// ('down' | 'forward' | 'up' | 'raise' | angle), itemL/itemR(hx, hy), itemOver(handL, handR),
// cls, nod, age ('child' | 'adult' | 'older'), jerseyInk (the jersey number's colour).
export function person(o = {}) {
  const x = o.x ?? 0,
    y = o.y ?? FLOOR,
    s = o.s ?? (o.age === 'child' ? 0.62 : 1);
  const skin = o.skin || '#c98b62';
  const hair = o.hair || (o.age === 'older' ? '#8d8f94' : SC.hair);
  const sareeCol = o.saree ? (typeof o.saree === 'string' ? o.saree : o.shirt || '#c0466a') : null;
  const shirt = sareeCol ? o.blouse || shade(sareeCol, -30) : o.shirt || '#3f7f5f';
  const border = o.border || '#e2a72e';
  const pants = sareeCol || (o.kurta ? o.pants || '#efe6d6' : o.pants || SC.pants);
  const shoes = o.shoes || (sareeCol || o.kurta ? '#7a4a2a' : SC.shoe);
  const coat = o.coat;
  const sleeve = coat ? o.coatSleeve || '#f4f7fb' : shade(shirt, -7);
  const sit = !!o.sit,
    dy = sit ? 36 : 0;
  const headY = -292 + dy,
    tTop = -256 + dy,
    tBot = -132 + dy;
  const shY = tTop + 17;
  const tw = 37;
  const sandal = !!(sareeCol || o.kurta);
  let g = '';
  g += `<ellipse cx="0" cy="1" rx="${sit ? 64 : 50}" ry="7" fill="#0b2e6e" opacity=".08"/>`;
  // ---- feet (sandals for a saree or kurta, shoes otherwise)
  const feet = (dx = 0) =>
    sandal
      ? `<path d="M${-36 - dx} 0v-5a7 7 0 0 1 7 -7h20v12z" fill="${skin}"/><path d="M${36 + dx} 0v-5a7 7 0 0 0 -7 -7H${9 + dx}v12z" fill="${skin}"/><rect x="${-38 - dx}" y="-3" width="30" height="4" rx="2" fill="${shoes}"/><rect x="${8 + dx}" y="-3" width="30" height="4" rx="2" fill="${shoes}"/>`
      : `<path d="M${-41 - dx} 0v-6a9 9 0 0 1 9-9h27v15z" fill="${shoes}"/><path d="M${41 + dx} 0v-6a9 9 0 0 0-9-9H${5 + dx}v15z" fill="${shoes}"/>`;
  // ---- legs / seat
  if (!sit) {
    if (sareeCol) {
      g += feet();
      g += `<path d="M${-tw + 2} ${tBot - 6}L${-tw - 8} -8Q0 -2 ${tw + 8} -8L${tw - 2} ${tBot - 6}Z" fill="${sareeCol}"/>`;
      g += `<path d="M${-tw - 8} -8Q0 -2 ${tw + 8} -8l-1 -10Q0 -12 ${-tw - 7} -18Z" fill="${border}"/>`;
      g += `<path d="M6 ${tBot}L10 -12M-4 ${tBot + 10}L-2 -10M16 ${tBot + 6}L24 -14" stroke="${shade(sareeCol, -14)}" stroke-width="2.5" fill="none"/>`;
    } else if (o.shorts) {
      g += `<rect x="-30" y="-122" width="23" height="110" rx="4" fill="${skin}"/><rect x="7" y="-122" width="23" height="110" rx="4" fill="${skin}"/>`;
      g += `<path d="M-35 -136h70v36h-30l-5-10-5 10h-30z" fill="${pants}"/>`;
      g += `<rect x="-31" y="-36" width="25" height="22" fill="${o.socks || '#fff'}"/><rect x="6" y="-36" width="25" height="22" fill="${o.socks || '#fff'}"/>`;
      g += feet();
    } else {
      g += `<rect x="-31" y="-138" width="25" height="126" rx="3" fill="${pants}"/><rect x="6" y="-138" width="25" height="126" rx="3" fill="${pants}"/>`;
      g += feet();
    }
    if (o.shoeAccent) g += `<rect x="-41" y="-4" width="36" height="4" fill="${o.shoeAccent}"/><rect x="5" y="-4" width="36" height="4" fill="${o.shoeAccent}"/>`;
  } else {
    g += `<rect x="-40" y="${tBot - 8}" width="80" height="30" rx="10" fill="${pants}"/>`;
    g += `<rect x="-33" y="${tBot + 14}" width="25" height="${-tBot - 26}" rx="3" fill="${shade(pants, -8)}"/><rect x="8" y="${tBot + 14}" width="25" height="${-tBot - 26}" rx="3" fill="${shade(pants, -8)}"/>`;
    if (sareeCol) g += `<rect x="-35" y="-26" width="70" height="8" rx="2" fill="${border}"/>`;
    g += feet(2);
  }
  // ---- back hair (long / ponytail / braid)
  if (o.hairStyle === 'long')
    g += `<path d="M-29 ${headY - 4}C-31 ${headY - 40} 31 ${headY - 40} 29 ${headY - 4}L32 ${headY + 46}C24 ${headY + 52} 14 ${headY + 50} 12 ${headY + 40}L-12 ${headY + 40}C-14 ${headY + 50} -24 ${headY + 52} -32 ${headY + 46}Z" fill="${hair}"/>`;
  if (o.hairStyle === 'pony') g += `<path d="M18 ${headY - 16}C40 ${headY - 10} 44 ${headY + 22} 34 ${headY + 44}C30 ${headY + 30} 26 ${headY + 12} 14 ${headY - 2}Z" fill="${hair}"/>`;
  // ---- neck
  g += `<rect x="-8" y="${tTop - 15}" width="16" height="20" fill="${shade(skin, -12)}"/>`;
  // ---- torso (a kurta runs to the knee)
  const kb = o.kurta ? tBot + (sit ? 30 : 70) : tBot;
  const kw = o.kurta ? tw + 6 : tw;
  g += `<path d="M${-kw} ${kb}L${-tw} ${tTop + 22}Q${-tw} ${tTop} ${-tw + 22} ${tTop}H${tw - 22}Q${tw} ${tTop} ${tw} ${tTop + 22}L${kw} ${kb}Z" fill="${shirt}"/>`;
  if (o.kurta) g += `<path d="M${-kw + 4} ${kb}l3 -40M${kw - 4} ${kb}l-3 -40" stroke="${shade(shirt, -18)}" stroke-width="2"/><path d="M-6 ${tTop}l6 22l6 -22" fill="none" stroke="${shade(shirt, -20)}" stroke-width="2.5"/>`;
  if (o.vest) {
    g += `<path d="M${-tw} ${tBot}V${tTop + 22}Q${-tw} ${tTop} ${-tw + 18} ${tTop}H-12L0 ${tTop + 38}L12 ${tTop}H${tw - 18}Q${tw} ${tTop} ${tw} ${tTop + 22}V${tBot}Z" fill="${o.vest}"/>`;
    g += `<rect x="${-tw}" y="${tBot - 16}" width="${tw * 2}" height="5" fill="${o.vestStripe || '#fff'}" opacity=".85"/>`;
    if (o.vestText) g += `<text x="0" y="${tTop + 80}" text-anchor="middle" font-size="${Math.min(11, 120 / o.vestText.length)}" font-weight="900" fill="#fff" letter-spacing=".6">${esc(o.vestText)}</text>`;
  }
  if (coat) {
    g += `<path d="M${-tw - 2} ${tBot + 30}V${tTop + 22}Q${-tw - 2} ${tTop - 1} ${-tw + 20} ${tTop - 1}H-9L0 ${tTop + 44}L9 ${tTop - 1}H${tw - 20}Q${tw + 2} ${tTop - 1} ${tw + 2} ${tTop + 22}V${tBot + 30}Z" fill="${coat}"/>`;
    g += `<path d="M-9 ${tTop - 1}L-2 ${tTop + 40}M9 ${tTop - 1}L2 ${tTop + 40}" stroke="#d5dde8" stroke-width="2"/>`;
  }
  if (o.jersey) g += `<text x="0" y="${tTop + 78}" text-anchor="middle" font-size="34" font-weight="900" fill="${o.jerseyInk || '#fff'}" opacity=".9">${esc(o.jersey)}</text>`;
  if (o.mud)
    g += `<g fill="#7a5230" opacity=".85"><ellipse cx="-16" cy="${tTop + 92}" rx="12" ry="8"/><ellipse cx="18" cy="${tTop + 40}" rx="8" ry="6"/><ellipse cx="10" cy="${tBot - 12}" rx="14" ry="7"/><circle cx="-22" cy="${tTop + 30}" r="4"/></g>${
      !sit ? `<g fill="#7a5230" opacity=".85"><ellipse cx="-20" cy="-70" rx="9" ry="12"/><ellipse cx="18" cy="-48" rx="8" ry="10"/><ellipse cx="-14" cy="-24" rx="10" ry="6"/></g>` : ''
    }`;
  // ---- saree pallu across the torso
  if (sareeCol) {
    g += `<path d="M${-tw} ${tTop + 18}Q${-tw + 4} ${tTop - 2} ${-tw + 24} ${tTop}L${tw} ${tBot - 34}V${tBot}H${-tw}Z" fill="${sareeCol}"/>`;
    g += `<path d="M${-tw + 24} ${tTop}L${tw} ${tBot - 34}" stroke="${border}" stroke-width="6"/>`;
    g += `<path d="M${-tw + 6} ${tTop + 40}L${tw - 12} ${tBot - 4}" stroke="${shade(sareeCol, -14)}" stroke-width="2.5"/>`;
  }
  if (o.dupatta) g += `<path d="M${-tw + 4} ${tTop + 2}C${-tw + 14} ${tTop + 40} ${tw - 14} ${tTop + 40} ${tw - 4} ${tTop + 2}" fill="none" stroke="${o.dupatta}" stroke-width="12" stroke-linecap="round"/><path d="M${tw - 6} ${tTop + 4}V${tBot + 20}" stroke="${o.dupatta}" stroke-width="12" stroke-linecap="round"/>`;
  if (o.bag) g += `<path d="M${-tw + 4} ${tTop + 6}L${tw - 2} ${tBot - 8}" stroke="${o.bagStrap || '#1f2937'}" stroke-width="7" stroke-linecap="round"/>`;
  if (o.satchel) g += `<rect x="${tw - 14}" y="${tBot - 26}" width="34" height="40" rx="6" fill="${o.satchel}"/><rect x="${tw - 14}" y="${tBot - 26}" width="34" height="12" rx="4" fill="${shade(o.satchel, -18)}"/>`;
  // ---- arms (thick rounded strokes) + hands
  const arm = (side, pose) => {
    const sx = side * 44;
    let pts, hand;
    const A = (deg, len = 104) => {
      const r = (deg * Math.PI) / 180;
      return [sx + side * Math.sin(r) * len, shY + Math.cos(r) * len];
    };
    if (pose === 'forward') {
      const el = [side * 48, shY + 66];
      hand = [side * 16, shY + 70];
      pts = [[sx, shY], el, hand];
    } else if (pose === 'up') {
      const el = [side * 58, shY + 56];
      hand = [side * 24, headY + 4];
      pts = [[sx, shY], el, hand];
    } else if (pose === 'raise') {
      const el = [side * 62, shY + 44];
      hand = [side * 70, shY - 18];
      pts = [[sx, shY], el, hand];
    } else if (pose === 'hold') {
      // held up in front of the chest, as when filming or photographing
      const el = [side * 54, shY + 50];
      hand = [side * 20, shY + 18];
      pts = [[sx, shY], el, hand];
    } else if (typeof pose === 'number') {
      hand = A(pose);
      pts = [[sx, shY], hand];
    } else {
      hand = [side * 46, tBot - 2];
      pts = [[sx, shY], hand];
    }
    const bare = sareeCol || o.shortSleeve;
    const col = bare ? skin : pose === 'forward' ? (coat && o.coatSleeve ? shade(o.coatSleeve, 8) : shade(coat ? '#e6ebf2' : shirt, -10)) : sleeve;
    let path = `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (bare) {
      const [p0, p1] = pts;
      const mid = [p0[0] + (p1[0] - p0[0]) * 0.32, p0[1] + (p1[1] - p0[1]) * 0.32];
      path += `<line x1="${p0[0]}" y1="${p0[1]}" x2="${mid[0]}" y2="${mid[1]}" stroke="${sareeCol ? shirt : shade(shirt, -7)}" stroke-width="17" stroke-linecap="round"/>`;
      if (sareeCol) path += `<circle cx="${pts[pts.length - 1][0] - side * 0}" cy="${pts[pts.length - 1][1]}" r="10" fill="none" stroke="${o.bangles || '#d4a017'}" stroke-width="2.5" opacity=".9"/>`;
    }
    return { path, hand };
  };
  const aL = arm(-1, o.armL || 'down'),
    aR = arm(1, o.armR || 'down');
  if (o.front) g += o.front;
  g += aL.path + aR.path;
  // ---- label on chest (over the upper arms, under held items)
  if (o.label) {
    const fs = 11.5,
      lw = String(o.label).length * 8.4 + 14;
    const ly = tTop + 24;
    g += `<rect x="${-lw / 2}" y="${ly}" width="${lw}" height="21" rx="10.5" fill="#fff"/><text x="0" y="${ly + 15}" text-anchor="middle" font-size="${fs}" font-weight="800" letter-spacing="1" fill="${o.labelInk || shade(o.vest || shirt, -30)}">${esc(o.label)}</text>`;
  }
  if (o.itemL) g += o.itemL(aL.hand[0], aL.hand[1]);
  if (o.itemR) g += o.itemR(aR.hand[0], aR.hand[1]);
  g += `<circle cx="${aL.hand[0]}" cy="${aL.hand[1]}" r="8" fill="${skin}"/><circle cx="${aR.hand[0]}" cy="${aR.hand[1]}" r="8" fill="${skin}"/>`;
  if (o.itemOver) g += o.itemOver(aL.hand, aR.hand);
  // ---- head
  let head = `<ellipse cx="0" cy="${headY}" rx="24" ry="27" fill="${skin}"/>`;
  if (o.beard) head += `<path d="M-22 ${headY + 4}C-20 ${headY + 30} 20 ${headY + 30} 22 ${headY + 4}C16 ${headY + 14} -16 ${headY + 14} -22 ${headY + 4}Z" fill="${hair}"/>`;
  if (o.mustache) head += `<path d="M-11 ${headY + 12}q11 -7 22 0q-11 4 -22 0z" fill="${o.age === 'older' ? '#5b5d62' : hair}"/>`;
  const hs = o.hairStyle || 'short';
  if (o.helmet) {
    head += `<path d="M-28 ${headY + 2}C-30 ${headY - 40} 30 ${headY - 40} 28 ${headY + 2}Z" fill="${o.helmet}"/><rect x="-28" y="${headY - 2}" width="56" height="7" rx="3" fill="${shade(o.helmet, -30)}"/>`;
  } else if (hs === 'short' || hs === 'grey') {
    const hc = hs === 'grey' ? '#8d8f94' : hair;
    head += `<path d="M-25 ${headY - 2}C-26 ${headY - 34} 26 ${headY - 34} 25 ${headY - 2}C22 ${headY - 13} 12 ${headY - 17} 0 ${headY - 17}C-12 ${headY - 17} -22 ${headY - 13} -25 ${headY - 2}Z" fill="${hc}"/>`;
    head += `<rect x="-26" y="${headY - 6}" width="4" height="14" rx="2" fill="${hc}"/><rect x="22" y="${headY - 6}" width="4" height="14" rx="2" fill="${hc}"/>`;
  } else {
    // a centre parting, the usual way women in the scenes wear their hair
    head += `<path d="M-26 ${headY + 6}C-30 ${headY - 36} 30 ${headY - 36} 26 ${headY + 6}C24 ${headY - 8} 14 ${headY - 16} 2 ${headY - 17}L0 ${headY - 12}L-2 ${headY - 17}C-14 ${headY - 16} -24 ${headY - 8} -26 ${headY + 6}Z" fill="${hair}"/>`;
    if (hs === 'bun') head += `<circle cx="0" cy="${headY - 30}" r="12" fill="${hair}"/>`;
    if (o.bindi) head += `<circle cx="0" cy="${headY - 6}" r="2.6" fill="#c0262d"/>`;
  }
  if (o.cap) head += `<path d="M-26 ${headY - 6}C-26 ${headY - 38} 26 ${headY - 38} 26 ${headY - 6}Z" fill="${o.cap}"/><path d="M-4 ${headY - 8}H40Q44 ${headY - 2} 36 ${headY}H-4Z" fill="${shade(o.cap, -20)}"/>`;
  if (o.glasses) head += `<g fill="none" stroke="#1f2937" stroke-width="2"><rect x="-17" y="${headY - 2}" width="13" height="9" rx="3"/><rect x="4" y="${headY - 2}" width="13" height="9" rx="3"/><path d="M-4 ${headY + 2}h8"/></g>`;
  if (hs === 'braid') head += `<path d="M-22 ${headY + 4}C-30 ${headY + 30} -30 ${headY + 60} -26 ${headY + 92}" stroke="${hair}" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="-26" cy="${headY + 96}" r="5" fill="${o.border || '#e2a72e'}"/>`;
  if (o.headCover && sareeCol)
    head += `<path d="M-30 ${headY + 14}C-34 ${headY - 44} 34 ${headY - 44} 30 ${headY + 14}L${tw - 2} ${tTop + 30}L${tw - 12} ${tTop + 8}C24 ${headY + 4} 22 ${headY - 20} 0 ${headY - 22}C-22 ${headY - 20} -24 ${headY + 4} -24 ${headY + 18}L${-tw + 6} ${tTop + 14}Z" fill="${sareeCol}"/><path d="M-30 ${headY + 14}C-34 ${headY - 44} 34 ${headY - 44} 30 ${headY + 14}" fill="none" stroke="${border}" stroke-width="4"/>`;
  g += o.nod ? `<g class="nod">${head}</g>` : head;
  if (o.over) g += o.over({ headY, tTop, tBot, shY });
  return `<g class="${o.cls || ''}" style="${o.style || ''}"><g transform="translate(${x} ${y}) scale(${s})">${g}</g></g>`;
}
// Head-top y of a person at scale s (for placing bubbles).
export const headTop = (o = {}) => (o.y ?? FLOOR) - (o.sit ? 283 : 319) * (o.s ?? (o.age === 'child' ? 0.62 : 1));

// ───────────────────────────── settings and props ─────────────────────────────
// A string of marigolds over a door (x1 to x2 at y).
export function toran(x1, x2, y) {
  const n = Math.round((x2 - x1) / 16);
  let s = `<path d="M${x1} ${y}Q${(x1 + x2) / 2} ${y + 16} ${x2} ${y}" stroke="#5a7d2a" stroke-width="2" fill="none"/>`;
  for (let i = 0; i <= n; i++) {
    const t = i / n,
      px = x1 + (x2 - x1) * t,
      py = y + 4 * 16 * t * (1 - t);
    s += `<circle cx="${px}" cy="${py + 4}" r="6" fill="${i % 2 ? '#f59e0b' : '#f97316'}"/>${i % 3 === 1 ? `<path d="M${px} ${py + 10}l-4 14l4 -3l4 3z" fill="#4c9a4c"/>` : ''}`;
  }
  return s;
}
// A rangoli on the floor, centred at (cx, cy), seen at a low angle.
export function rangoli(cx, cy, r = 54) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `<ellipse cx="${cx + Math.cos(a) * r * 0.55}" cy="${cy + Math.sin(a) * r * 0.55 * 0.32}" rx="${r * 0.26}" ry="${r * 0.1}" fill="${['#e11d48', '#f59e0b', '#7c3aed', '#16a34a'][i % 4]}" transform="rotate(${(a * 180) / Math.PI * 0.32} ${cx + Math.cos(a) * r * 0.55} ${cy + Math.sin(a) * r * 0.55 * 0.32})"/>`;
  }).join('');
  return `<g><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.32}" fill="#fde68a"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.9}" ry="${r * 0.28}" fill="none" stroke="#e11d48" stroke-width="3"/>${petals}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.2}" ry="${r * 0.07}" fill="#fff"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.1}" ry="${r * 0.035}" fill="#f97316"/></g>`;
}
// A charpai (woven cot), x1 to x2, top at y.
export function charpai(x1, x2, top = 400) {
  let weave = '';
  for (let i = x1 + 14; i < x2 - 8; i += 14) weave += `<line x1="${i}" y1="${top + 2}" x2="${i + 8}" y2="${top + 12}" stroke="#c9a26a" stroke-width="2"/>`;
  return `<g><rect x="${x1 + 6}" y="${top}" width="16" height="${FLOOR - top}" rx="3" fill="#8a5a2b"/><rect x="${x2 - 22}" y="${top}" width="16" height="${FLOOR - top}" rx="3" fill="#8a5a2b"/>
    <rect x="${x1}" y="${top}" width="${x2 - x1}" height="14" rx="4" fill="#e3c38d"/>${weave}<rect x="${x1}" y="${top - 4}" width="${x2 - x1}" height="7" rx="3" fill="#9c6a35"/><rect x="${x1}" y="${top + 12}" width="${x2 - x1}" height="6" rx="3" fill="#9c6a35"/></g>`;
}
// A steel bucket (centre cx, bottom by) with clothes soaking; o.foam for a demo.
export function bucket(cx, by, s = 1, o = {}) {
  return `<g transform="translate(${cx} ${by}) scale(${s})"><path d="M-40 -70h80l-8 70h-64z" fill="${o.col || '#9aa7b8'}"/><rect x="-44" y="-76" width="88" height="10" rx="4" fill="${shade(o.col || '#9aa7b8', -18)}"/><path d="M-36 -74q36 -40 72 0" fill="none" stroke="#6b7280" stroke-width="3"/>
    <ellipse cx="0" cy="-72" rx="38" ry="7" fill="${o.foam ? '#e0f2fe' : '#7dd3fc'}"/>${o.foam ? '<circle cx="-18" cy="-78" r="7" fill="#fff"/><circle cx="-4" cy="-82" r="9" fill="#fff"/><circle cx="14" cy="-78" r="7" fill="#fff"/>' : ''}<path d="M-20 -72q10 -14 22 -2q8 -10 18 0" fill="none" stroke="${o.cloth || '#e05a8a'}" stroke-width="7" stroke-linecap="round"/></g>`;
}
// A washing machine: 'top' (lid open) or 'front' load; left x, bottom on the floor.
export function washer(x, type = 'top', o = {}) {
  const w = 150,
    h = type === 'front' ? 180 : 150,
    y = FLOOR - h;
  let s = `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#f5f7fa" stroke="#cbd5e1" stroke-width="2"/><rect x="${x}" y="${y}" width="${w}" height="28" rx="8" fill="#e2e8f0"/><circle cx="${x + w - 24}" cy="${y + 14}" r="7" fill="#94a3b8"/><rect x="${x + 14}" y="${y + 9}" width="44" height="10" rx="3" fill="#1e293b"/><text x="${x + 18}" y="${y + 17}" font-size="8" font-weight="700" fill="#5eead4">${o.prog || '0:42'}</text>`;
  if (type === 'front')
    s += `<circle cx="${x + w / 2}" cy="${y + 104}" r="52" fill="#cbd5e1"/><circle cx="${x + w / 2}" cy="${y + 104}" r="42" fill="#bae6fd"/><path d="M${x + w / 2 - 34} ${y + 112}q34 -22 68 0v10q-34 24 -68 0z" fill="${o.cloth || '#60a5fa'}" opacity=".8"/><circle cx="${x + w / 2 - 14}" cy="${y + 88}" r="6" fill="#fff" opacity=".8"/>`;
  else
    s += `<path d="M${x + 10} ${y}L${x + 30} ${y - 70}H${x + w - 30}L${x + w - 10} ${y}Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/><path d="M${x + 36} ${y - 60}H${x + w - 36}L${x + w - 24} ${y - 6}H${x + 24}Z" fill="#bae6fd" opacity=".7"/><rect x="${x + 16}" y="${y + 40}" width="${w - 32}" height="4" rx="2" fill="#e2e8f0"/>`;
  return s + `<rect x="${x + 8}" y="${FLOOR - 6}" width="${w - 16}" height="6" fill="#cbd5e1"/></g>`;
}
// A clothes line with laundry, x1 to x2 at y.
export function clothesLine(x1, x2, y) {
  const cols = ['#e05a8a', '#60a5fa', '#fbbf24', '#34d399', '#f8fafc', '#a78bfa'];
  let s = `<path d="M${x1} ${y}Q${(x1 + x2) / 2} ${y + 14} ${x2} ${y}" stroke="#64748b" stroke-width="2.5" fill="none"/>`;
  const n = Math.floor((x2 - x1) / 70);
  for (let i = 0; i < n; i++) {
    const cx = x1 + 30 + i * 70,
      c = cols[i % cols.length];
    s +=
      i % 2
        ? `<path d="M${cx - 22} ${y + 6}h44l6 16h-10v40h-36v-40h-10z" fill="${c}" stroke="${shade(c, -15)}"/>`
        : `<rect x="${cx - 16}" y="${y + 6}" width="32" height="54" rx="2" fill="${c}" stroke="${shade(c, -15)}"/>`;
  }
  return s;
}
// A scooter (rear at x, wheels on the floor); o.box draws a delivery box in the partner's colour.
export function scooter(x, col = '#e11d48', o = {}) {
  const y = FLOOR;
  let s = `<g><circle cx="${x + 30}" cy="${y - 26}" r="26" fill="#1f2937"/><circle cx="${x + 30}" cy="${y - 26}" r="11" fill="#9ca3af"/><circle cx="${x + 170}" cy="${y - 26}" r="26" fill="#1f2937"/><circle cx="${x + 170}" cy="${y - 26}" r="11" fill="#9ca3af"/>
    <path d="M${x} ${y - 56}Q${x + 6} ${y - 110} ${x + 70} ${y - 104}H${x + 116}L${x + 126} ${y - 60}H${x + 150}L${x + 170} ${y - 140}L${x + 184} ${y - 138}L${x + 176} ${y - 92}Q${x + 200} ${y - 70} ${x + 196} ${y - 40}H${x + 4}Z" fill="${col}"/>
    <rect x="${x + 22}" y="${y - 118}" width="86" height="16" rx="8" fill="#111827"/><path d="M${x + 160} ${y - 146}h34" stroke="#111827" stroke-width="6" stroke-linecap="round"/><circle cx="${x + 192}" cy="${y - 118}" r="7" fill="#fde68a"/>`;
  if (o.box) {
    const p = PARTNERS[o.box] || {};
    s += `<rect x="${x + 6}" y="${y - 200}" width="96" height="84" rx="6" fill="${p.bg || '#f8cb46'}"/><rect x="${x + 6}" y="${y - 200}" width="96" height="16" rx="6" fill="${shade(p.bg || '#f8cb46', -15)}"/><rect x="${x + 22}" y="${y - 176}" width="64" height="52" rx="8" fill="#fff"/>${partnerLogo(o.box, x + 28, y - 172, 52, 44)}`;
  }
  return s + '</g>';
}
// A ring light on a stand (centre cx, ring centre y = cy).
export function ringLight(cx, cy, r = 62) {
  return `<g><rect x="${cx - 3}" y="${cy + r}" width="6" height="${FLOOR - cy - r - 10}" fill="#374151"/><path d="M${cx} ${FLOOR - 14}l-34 14M${cx} ${FLOOR - 14}l34 14M${cx} ${FLOOR - 14}v14" stroke="#374151" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 26}" fill="#fff7d6" opacity=".55" class="glow"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fffbeb" stroke-width="16"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fde68a" stroke-width="3" opacity=".8"/></g>`;
}
// A tripod with a phone, screen toward the subject (side view). Centre cx.
export function tripodPhone(cx, top = 250) {
  return `<g><path d="M${cx} ${top + 40}L${cx - 40} ${FLOOR}M${cx} ${top + 40}L${cx + 40} ${FLOOR}M${cx} ${top + 40}V${FLOOR}" stroke="#374151" stroke-width="5" stroke-linecap="round"/><rect x="${cx - 6}" y="${top + 20}" width="12" height="22" fill="#374151"/>
    <rect x="${cx - 32}" y="${top - 6}" width="64" height="30" rx="5" fill="#111827"/><rect x="${cx - 29}" y="${top - 3}" width="58" height="24" rx="3" fill="#475569"/><circle cx="${cx + 20}" cy="${top + 9}" r="4" fill="#ef4444" class="blink"/></g>`;
}
// A football.
export const football = (cx, cy, r = 18) =>
  `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#1f2937" stroke-width="2"/><path d="M${cx} ${cy - r * 0.35}l${r * 0.33} ${r * 0.24}-${r * 0.13} ${r * 0.4}h-${r * 0.4}l-${r * 0.13}-${r * 0.4}z" fill="#1f2937"/><path d="M${cx - r} ${cy}l${r * 0.4} 0M${cx + r} ${cy}l-${r * 0.4} 0M${cx} ${cy + r}v-${r * 0.38}" stroke="#1f2937" stroke-width="2"/></g>`;

// A football jersey laid flat (centre cx, collar at top, width w), with its number; o.mud adds
// mud stains, o.rot tilts it, o.ink colours the number.
export function jersey(cx, top, w = 80, col = '#e11d48', num = '', o = {}) {
  const k = w / 92;
  const mud = o.mud
    ? `<g fill="#7a5230" opacity=".85"><ellipse cx="-14" cy="66" rx="13" ry="8"/><ellipse cx="18" cy="30" rx="9" ry="6"/><ellipse cx="10" cy="78" rx="15" ry="6"/><circle cx="-24" cy="38" r="5"/><ellipse cx="-40" cy="20" rx="5" ry="4"/></g>`
    : '';
  return `<g transform="translate(${cx} ${top}) rotate(${o.rot || 0}) scale(${k})"><path d="M-30 0H-12Q0 12 12 0H30L46 14L38 32L30 26V88H-30V26L-38 32L-46 14Z" fill="${col}" stroke="${shade(col, -22)}" stroke-width="2" stroke-linejoin="round"/><path d="M-12 0Q0 12 12 0" fill="none" stroke="#fff" stroke-width="3"/>${num ? `<text x="0" y="62" text-anchor="middle" font-size="30" font-weight="900" fill="${o.ink || '#fff'}" opacity=".9">${esc(num)}</text>` : ''}${mud}</g>`;
}

// A poster on a wall: brand panel with logo, the real pack and a headline. x, y top-left.
export function poster(k, x, y, w = 130, h = 180, o = {}) {
  const b = brandOf(k);
  const lines = wrap(o.title ? [o.title] : [], 16).slice(0, 2);
  const ph = h * (lines.length ? 0.44 : 0.52);
  return `<g class="${o.cls || ''}" style="${o.style || ''}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" filter="url(#hsc-psh)"/><rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" rx="3" fill="${b.bg}"/>
    ${logoPlate(k, x + w * 0.16, y + 14, w * 0.68, h * 0.15, { r: 5 })}
    ${lines.map((l, i) => `<text x="${x + w / 2}" y="${y + h * 0.27 + 14 + i * (w * 0.1)}" text-anchor="middle" font-size="${w * 0.085}" font-weight="900" fill="${b.fg}">${esc(l)}</text>`).join('')}
    ${brandPack(k, x + w / 2, y + h - 30, Math.min(ph, ((w - 24) * ph) / Math.max(1, packW(k, ph))), { shadow: false })}
    <rect x="${x + 10}" y="${y + h - 26}" width="${w - 20}" height="16" rx="2" fill="${o.ctaBg || '#fff'}"/><text x="${x + w / 2}" y="${y + h - 14}" text-anchor="middle" font-size="${Math.min(10, (w - 24) / Math.max(1, (o.cta || 'FREE SAMPLE').length) / 0.62)}" font-weight="800" fill="${o.ctaInk || b.bg}" letter-spacing=".6">${esc(o.cta || 'FREE SAMPLE')}</text></g>`;
}
// A floor standee carrying a poster (left x, floor by, width w).
export function standee(k, x, by = FLOOR, w = 100, o = {}) {
  const h = w * 1.8;
  return `<g><path d="M${x + w * 0.2} ${by}l${w * 0.3} -26l${w * 0.3} 26z" fill="#9aa3b2"/>${poster(k, x, by - h - 18, w, h, o)}</g>`;
}
// A TV on the wall showing the brand's ad.
export function tv(x, y, w, h, k) {
  return `<g><rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" rx="6" fill="#111827"/>${scenePhoto(k, x, y, w, h, 2)}<rect x="${x + 8}" y="${y + 8}" width="${w * 0.3}" height="${h * 0.16}" rx="3" fill="#fff" opacity=".92"/>${logoImg(k, x + 12, y + 10, w * 0.3 - 8, h * 0.16 - 4)}<rect x="${x + w - 36}" y="${y + h - 20}" width="28" height="12" rx="2" fill="#facc15"/><text x="${x + w - 22}" y="${y + h - 11}" text-anchor="middle" font-size="8" font-weight="900" fill="#111">AD</text></g>`;
}

// An AI voice call card: header with language and timer, waveform, transcript lines.
// lines: [{ who: 'ai' | 'c', text, name? }]
export function callCard(x, y, w, o = {}) {
  const fs = o.fs || 18,
    lh = fs + 6;
  const busy = o.state === 'busy';
  const live = o.state !== 'ended' && !busy;
  const rows = (o.lines || []).map((l) => ({ ...l, wr: wrapW([l.text], fs, w - callIndent(l, o) - 18) }));
  const bodyH = rows.reduce((a, r) => a + r.wr.length * lh + 14, 0);
  // o.note: a status pill under the waveform (e.g. a busy line and its retry), after any transcript
  const noteH = o.note ? 44 : 0;
  const h = 118 + bodyH + noteH;
  const b = brandOf(o.brand);
  let bars = '';
  for (let i = 0; i < 26; i++) {
    const bh = busy ? 4 : 8 + ((i * 37) % 23);
    bars += `<rect x="${x + 24 + i * ((w - 48) / 26)}" y="${y + 84 - bh / 2}" width="${(w - 48) / 26 - 4}" height="${bh}" rx="2" fill="${live ? '#22c55e' : '#94a3b8'}" class="${live ? 'wbar' : ''}" style="animation-delay:${(i % 7) * 0.11}s"/>`;
  }
  let ty = y + 116;
  const body = rows
    .map((r) => {
      const ai = r.who === 'ai';
      const chip = callChip(r);
      const cw = tW(chip, 11) + 16;
      const out = `<rect x="${x + 20}" y="${ty - 13}" width="${cw}" height="19" rx="9.5" fill="${ai ? SC.navy : SC.orange}"/><text x="${x + 20 + cw / 2}" y="${ty + 1}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" letter-spacing=".8">${esc(chip)}</text>${r.wr
        .map((l, i) => `<text x="${x + callIndent(r, o)}" y="${ty + 2 + i * lh}" font-size="${fs}" font-weight="${ai ? 600 : 700}" fill="${ai ? '#334155' : SC.ink}">${esc(l)}</text>`)
        .join('')}`;
      ty += r.wr.length * lh + 14;
      return out;
    })
    .join('');
  return `<g class="${o.cls || ''}" style="${o.style || ''}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff" stroke="${SC.navy}" stroke-width="3.5"/>
    <path d="M${x + 18} ${y}H${x + w - 18}Q${x + w} ${y} ${x + w} ${y + 18}V${y + 56}H${x}V${y + 18}Q${x} ${y} ${x + 18} ${y}Z" fill="${SC.navy}"/>
    ${logoPlate(o.brand, x + 14, y + 10, 64, 36, { r: 8, pad: 5 })}
    <text x="${x + 90}" y="${y + 26}" font-size="13" font-weight="800" fill="#fff" letter-spacing="1.4">${esc(o.title || 'AI VOICE CALL')}</text>
    <text x="${x + 90}" y="${y + 45}" font-size="13" font-weight="600" fill="#bcd0f5">${esc(o.sub || b.name)}</text>
    <circle cx="${x + w - 70}" cy="${y + 28}" r="6" fill="${busy ? '#ef4444' : live ? '#22c55e' : '#94a3b8'}" class="${live || busy ? 'blink' : ''}"/><text x="${x + w - 58}" y="${y + 33}" font-size="15" font-weight="800" fill="#fff">${esc(o.dur || '0:34')}</text>
    ${bars}${body}${o.note ? `<rect x="${x + 20}" y="${ty - 12}" width="${tW(o.note, 15) + 30}" height="30" rx="15" fill="${busy ? '#fee2e2' : '#eef2f7'}"/><text x="${x + 35}" y="${ty + 8}" font-size="15" font-weight="800" fill="${busy ? '#b91c1c' : '#334155'}">${esc(o.note)}</text>` : ''}</g>`;
}
// Where a transcript line's text starts, after its speaker chip.
const callChip = (l) => (l.who === 'ai' ? 'AI' : (l.name || 'HER').toUpperCase());
const callIndent = (l) => 28 + Math.max(tW(callChip(l), 11) + 16, 44);
export const callCardH = (w, lines = [], fs = 18) => 118 + lines.reduce((a, l) => a + wrapW([l.text], fs, w - callIndent(l) - 18).length * (fs + 6) + 14, 0);

// A laptop or monitor dashboard (screen x, y, w, h): title bar, two KPIs, bars.
export function dashboard(x, y, w, h, o = {}) {
  const kpis = (o.kpis || [['Reached', '82%'], ['Converted', '31%']]).slice(0, 3);
  const bars = o.bars || [62, 50, 44, 36, 30, 22];
  const bw = (w - 40) / bars.length;
  const kw = (w - 20) / kpis.length;
  const max = Math.max(...bars);
  return `<g><rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" rx="8" fill="#1f2937"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff"/>
    <rect x="${x}" y="${y}" width="${w}" height="22" fill="${SC.navy}"/><text x="${x + 10}" y="${y + 15}" font-size="11" font-weight="700" fill="#fff">${esc(o.title || 'FreeStand Studio')}</text>
    ${kpis.map(([l, v], i) => `<text x="${x + 12 + i * kw}" y="${y + 42}" font-size="10.5" fill="#64748b">${esc(l)}</text><text x="${x + 12 + i * kw}" y="${y + 64}" font-size="20" font-weight="800" fill="${SC.ink}">${esc(v)}</text>`).join('')}
    ${bars.map((v, i) => `<rect x="${x + 20 + i * bw}" y="${y + h - 8 - (v / max) * (h - 90)}" width="${bw - 8}" height="${(v / max) * (h - 90)}" rx="2" fill="${i === (o.hi ?? 0) ? '#0a3578' : '#9db6e0'}" class="sv-pop" style="animation-delay:${0.3 + i * 0.1}s"/>`).join('')}</g>`;
}

// Hashed identifiers as a short stream of hex chunks.
export const hashChunk = (seed) => {
  let x = (seed * 2654435761) >>> 0;
  let s = '';
  for (let i = 0; i < 8; i++) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0;
    s += '0123456789abcdef'[(x >>> 16) & 15];
  }
  return s;
};
